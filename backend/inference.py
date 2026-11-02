"""
inference.py
------------
Image validation, preprocessing, prediction, and Grad-CAM-to-base64
supporting both Keras and PyTorch models.
"""

import base64
import io

import numpy as np
from PIL import Image, UnidentifiedImageError

import config
import gradcam

VALID_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB


class InvalidImageError(Exception):
    """Raised when the uploaded file is not a usable image."""
    pass


def validate_and_load_image(file_bytes: bytes, content_type: str, filename: str) -> Image.Image:
    if not file_bytes:
        raise InvalidImageError("The uploaded file is empty.")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise InvalidImageError(
            "The uploaded file is too large. Please upload an image under 15 MB."
        )

    if content_type not in VALID_CONTENT_TYPES:
        raise InvalidImageError(
            "Unable to process this image. Please upload a valid retinal image "
            "in JPG, JPEG or PNG format."
        )

    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.load()
    except (UnidentifiedImageError, OSError, ValueError):
        raise InvalidImageError(
            "This file could not be read as an image. It may be corrupted or "
            "in an unsupported format. Please upload a valid JPG, JPEG or PNG file."
        )

    try:
        image = image.convert("RGB")
    except Exception:
        raise InvalidImageError(
            "Unable to convert the uploaded file to a standard RGB image."
        )

    return image


def preprocess(image: Image.Image, model=None):
    """
    Prepares input tensor for prediction according to model backend.
    """
    backend_type = getattr(model, "_backend_type", "keras") if model else "keras"

    resized = image.resize(config.IMAGE_SIZE)

    if backend_type == "keras":
        # Returns float32 numpy array [1, 224, 224, 3] in RGB [0, 255]
        arr = np.array(resized, dtype=np.float32)
        return np.expand_dims(arr, axis=0)
    else:
        # PyTorch transform
        import torch
        tensor = config.PREDICTION_TRANSFORM(image)
        return tensor.unsqueeze(0)


def run_prediction(model, input_tensor, device) -> dict:
    backend_type = getattr(model, "_backend_type", "keras")

    if backend_type == "keras":
        import tensorflow as tf
        inp_arr = np.array(input_tensor, dtype=np.float32)
        outputs = model(inp_arr, training=False)
        probabilities = tf.nn.softmax(outputs, axis=1).numpy()[0]
    else:
        import torch
        input_tensor = input_tensor.to(device)
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1).squeeze(0).cpu().numpy()

    predicted_idx = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_idx])

    return {
        "predicted_idx": predicted_idx,
        "confidence": confidence,
        "probabilities": probabilities,
    }


def pil_to_base64(image: Image.Image, fmt: str = "JPEG") -> str:
    buf = io.BytesIO()
    image.convert("RGB").save(buf, format=fmt, quality=92)
    encoded = base64.b64encode(buf.getvalue()).decode("utf-8")
    mime = "image/jpeg" if fmt.upper() == "JPEG" else f"image/{fmt.lower()}"
    return f"data:{mime};base64,{encoded}"


def ndarray_to_base64(arr: np.ndarray, fmt: str = "JPEG") -> str:
    image = Image.fromarray(arr.astype("uint8"), mode="RGB")
    return pil_to_base64(image, fmt=fmt)


def build_gradcam_overlay(model, input_tensor, display_image: Image.Image,
                           target_class: int, device) -> str:
    display_resized = display_image.resize((224, 224)).convert("RGB")
    original_np = np.array(display_resized)

    cam = gradcam.generate_gradcam(model, input_tensor, target_class, device)
    overlay_np = gradcam.overlay_heatmap_on_image(original_np, cam, alpha=config.GRADCAM_ALPHA)

    return ndarray_to_base64(overlay_np)
