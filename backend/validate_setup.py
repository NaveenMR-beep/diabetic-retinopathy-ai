"""
validate_setup.py
------------------
Standalone sanity-check script — run this BEFORE starting the full API,
per the project's validation requirement. It verifies, in order:

  1. Model weights load successfully into HybridModel.
  2. One sample retinal image can pass through the model.
  3. Output tensor shape is [1, 5].
  4. Softmax probabilities sum to ~1.
  5. Grad-CAM runs successfully on the hybrid model.

Usage:
    cd backend
    python validate_setup.py path/to/a/retinal_image.jpg

If no image path is given, a synthetic random image is used for steps
2-5 (useful to confirm the code runs, but use a real fundus image to
also sanity-check the prediction itself).
"""

import sys

import numpy as np
import torch
from PIL import Image

import config
import inference
from model import ModelLoadError, load_hybrid_model


def main():
    print(f"Device: {config.DEVICE}")
    print(f"Model path: {config.MODEL_PATH}\n")

    # --- Step 1: model weights load successfully ---
    print("[1/5] Loading model weights ...")
    try:
        model, load_info = load_hybrid_model()
    except ModelLoadError as e:
        print("FAILED to load model.\n")
        print(e)
        sys.exit(1)

    if load_info["status"] == "partial":
        print("  -> PARTIAL LOAD WARNING:")
        print("    " + load_info["message"].replace("\n", "\n    "))
        print()
    else:
        print("  -> OK: model loaded and in eval() mode (full checkpoint match).\n")

    # --- Prepare one image ---
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        print(f"[2/5] Loading sample image from {image_path} ...")
        with open(image_path, "rb") as f:
            file_bytes = f.read()
        content_type = "image/png" if image_path.lower().endswith(".png") else "image/jpeg"
        image = inference.validate_and_load_image(file_bytes, content_type, image_path)
    else:
        print("[2/5] No image path given — generating a synthetic test image ...")
        image = Image.fromarray(
            (np.random.rand(224, 224, 3) * 255).astype("uint8"), mode="RGB"
        )
    print("  -> OK: image loaded and converted to RGB.\n")

    # --- Step 3 & 4: forward pass, shape, softmax sum ---
    print("[3/5] Running forward pass ...")
    input_tensor = inference.preprocess(image)
    result = inference.run_prediction(model, input_tensor, config.DEVICE)
    probs = result["probabilities"]

    print(f"  -> Output shape check: expecting (1, {config.NUM_CLASSES})")
    assert probs.shape == (config.NUM_CLASSES,), f"Unexpected probability vector shape: {probs.shape}"
    print("  -> OK: shape is correct.\n")

    print("[4/5] Checking softmax probabilities sum to ~1 ...")
    total = float(np.sum(probs))
    print(f"  -> Sum = {total:.6f}")
    assert abs(total - 1.0) < 1e-3, "Softmax probabilities do not sum to 1!"
    print("  -> OK.\n")

    print("Predicted class:", config.CLASS_NAMES[result["predicted_idx"]])
    print("Confidence:", f"{result['confidence'] * 100:.2f}%")
    for i, name in enumerate(config.CLASS_NAMES):
        print(f"    {name}: {probs[i] * 100:.2f}%")
    print()

    # --- Step 5: Grad-CAM ---
    print("[5/5] Running Grad-CAM on the hybrid model ...")
    try:
        data_url = inference.build_gradcam_overlay(
            model, input_tensor, image, result["predicted_idx"], config.DEVICE
        )
        assert data_url.startswith("data:image/"), "Grad-CAM did not return a valid image."
        print("  -> OK: Grad-CAM generated successfully.\n")
    except Exception as e:
        print("FAILED to generate Grad-CAM.")
        print(e)
        sys.exit(1)

    print("All validation checks passed. Safe to start the full API with:")
    print("  uvicorn main:app --reload")


if __name__ == "__main__":
    main()
