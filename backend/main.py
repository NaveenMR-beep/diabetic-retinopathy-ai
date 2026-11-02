"""
main.py
-------
FastAPI application entrypoint.

- Loads the HybridModel ONCE at startup (not per-request).
- Exposes POST /predict for image classification + Grad-CAM.
- Exposes GET /health and GET /model-info for the frontend's
  "Model Information" page and status checks.
- Centralized, human-readable error handling.
"""

import logging
import time

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import config
import inference
from model import ModelLoadError, load_hybrid_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dr-ai-backend")

app = FastAPI(
    title="Diabetic Retinopathy AI Screening API",
    description="Hybrid EfficientNet-B0 + ResNet50 inference service with Grad-CAM explainability.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------------------------------
# Model state — loaded once, held in memory for the life of the process.
# --------------------------------------------------------------------------

_model_state = {
    "model": None,
    "device": str(config.DEVICE),
    "loaded": False,
    "error": None,
    # "full" | "partial" | None — see model.load_hybrid_model
    "load_status": None,
    "load_warning": None,
}


@app.on_event("startup")
def load_model_on_startup():
    logger.info("Loading HybridModel from %s on device %s ...", config.MODEL_PATH, config.DEVICE)
    try:
        model, load_info = load_hybrid_model()
        _model_state["model"] = model
        _model_state["loaded"] = True
        _model_state["error"] = None
        _model_state["load_status"] = load_info["status"]
        _model_state["load_warning"] = load_info.get("message")

        if load_info["status"] == "partial":
            logger.warning("Model loaded with PARTIAL weights:\n%s", load_info["message"])
        else:
            logger.info("Model loaded successfully (full checkpoint match).")
    except ModelLoadError as e:
        # We do NOT crash the server — we keep it up so /health and
        # /model-info still respond, and /predict returns a clear error
        # instead of the process dying silently.
        _model_state["loaded"] = False
        _model_state["error"] = str(e)
        logger.error("Model failed to load:\n%s", e)


def _get_model_or_503():
    if not _model_state["loaded"] or _model_state["model"] is None:
        raise HTTPException(
            status_code=503,
            detail={
                "message": "The diabetic retinopathy model is not currently loaded on the server.",
                "reason": _model_state["error"] or "Unknown model loading error.",
            },
        )
    return _model_state["model"]


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok" if _model_state["loaded"] else "degraded",
        "model_loaded": _model_state["loaded"],
        "device": _model_state["device"],
        "error": _model_state["error"],
        "load_status": _model_state["load_status"],
        "load_warning": _model_state["load_warning"],
    }


@app.get("/model-info")
def model_info():
    """Static architecture description used by the frontend's Model Information page."""
    return {
        "name": "Hybrid EfficientNet-B0 + ResNet50",
        "description": (
            "A feature-level fusion architecture: the input retinal image is passed "
            "independently through an EfficientNet-B0 backbone and a ResNet50 backbone. "
            "Their pooled feature vectors are concatenated and passed through a shared "
            "fully-connected classifier head."
        ),
        "branches": [
            {"name": "EfficientNet-B0", "output_features": 1280},
            {"name": "ResNet50", "output_features": 2048},
        ],
        "combined_features": 3328,
        "classifier_head": [
            {"layer": "Linear", "in": 3328, "out": 512},
            {"layer": "ReLU"},
            {"layer": "Dropout", "p": 0.5},
            {"layer": "Linear", "in": 512, "out": config.NUM_CLASSES},
        ],
        "num_classes": config.NUM_CLASSES,
        "class_names": config.CLASS_NAMES,
        "device": _model_state["device"],
        "model_loaded": _model_state["loaded"],
        "load_status": _model_state["load_status"],
        "load_warning": _model_state["load_warning"],
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    model = _get_model_or_503()

    # --- 1-2. Validate file is an image, convert to RGB ---
    try:
        file_bytes = await file.read()
        image = inference.validate_and_load_image(
            file_bytes, file.content_type, file.filename
        )
    except inference.InvalidImageError as e:
        raise HTTPException(status_code=400, detail=str(e))

    start = time.time()

    try:
        # --- 3. Resize and normalize ---
        input_tensor = inference.preprocess(image, model=model)

        # --- 4-7. Forward pass, softmax, confidence, predicted class ---
        result = inference.run_prediction(model, input_tensor, config.DEVICE)
        predicted_idx = result["predicted_idx"]
        confidence = result["confidence"]
        probs = result["probabilities"]

        # --- Grad-CAM explainability ---
        gradcam_data_url = inference.build_gradcam_overlay(
            model, input_tensor, image, predicted_idx, config.DEVICE
        )
        original_data_url = inference.pil_to_base64(image.resize((224, 224)))

    except inference.InvalidImageError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        logger.exception("Runtime error during inference")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while running the model on this image: {e}",
        )
    except Exception as e:
        logger.exception("Unexpected server error during inference")
        raise HTTPException(
            status_code=500,
            detail="An unexpected server error occurred while analyzing the image. Please try again.",
        )

    elapsed_ms = round((time.time() - start) * 1000, 1)

    disease_info = config.DISEASE_INFO[predicted_idx]
    probabilities_dict = {
        config.CLASS_NAMES[i]: round(float(probs[i]), 4) for i in range(config.NUM_CLASSES)
    }

    response = {
        "predicted_class": config.CLASS_NAMES[predicted_idx],
        "class_index": predicted_idx,
        "confidence": round(confidence, 4),
        "risk_level": config.RISK_LEVELS[predicted_idx],
        "severity_style": config.SEVERITY_STYLE[predicted_idx],
        "probabilities": probabilities_dict,
        "original_image": original_data_url,
        "gradcam_image": gradcam_data_url,
        "explanation": disease_info["summary"],
        "possible_findings": disease_info["possible_findings"],
        "next_step": disease_info["next_steps"],
        "disclaimer": config.DISCLAIMER_TEXT,
        "urgent_symptoms_notice": config.URGENT_SYMPTOMS_TEXT,
        "inference_time_ms": elapsed_ms,
        "model": "EfficientNet-B0 + ResNet50 (Hybrid)",
        "classifier_calibrated": _model_state["load_status"] != "partial",
        "model_notice": _model_state["load_warning"],
    }
    return JSONResponse(content=response)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc):
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred. Please try again later."},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
