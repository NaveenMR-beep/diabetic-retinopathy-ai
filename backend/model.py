"""
model.py
--------
Model loader supporting lightweight TFLite ResNet50 (5-class DR) with full weights,
with fallback to Keras/TensorFlow.
"""

import os
import logging
import numpy as np
import config

logger = logging.getLogger("dr-ai-backend")


class ModelLoadError(Exception):
    """Raised when the checkpoint cannot be loaded into the model."""
    pass


class TFLiteModelWrapper:
    """
    Lightweight TFLite interpreter wrapper that fits comfortably in Render's 512MB RAM cap.
    Outputs: [predictions (1, 5), conv_features (1, 7, 7, 2048)]
    """
    def __init__(self, tflite_path: str):
        import tensorflow as tf
        self.interpreter = tf.lite.Interpreter(model_path=tflite_path)
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        self._backend_type = "tflite"

    def predict(self, input_tensor):
        self.interpreter.set_tensor(self.input_details[0]["index"], input_tensor)
        self.interpreter.invoke()

        preds = None
        conv_feats = None
        for o in self.output_details:
            data = self.interpreter.get_tensor(o["index"])
            if data.shape == (1, config.NUM_CLASSES):
                preds = data
            elif len(data.shape) == 4 and data.shape[1] == 7 and data.shape[2] == 7:
                conv_feats = data
        return preds, conv_feats


def build_keras_resnet50_model():
    """
    Constructs the exact Keras ResNet50 architecture matching model.weights (1).
    """
    import keras
    from keras.applications.resnet50 import ResNet50, preprocess_input

    inputs = keras.Input(shape=(224, 224, 3), name="input_layer")
    x = keras.layers.Lambda(preprocess_input, name="lambda")(inputs)
    base = ResNet50(include_top=False, weights=None, input_shape=(224, 224, 3))
    x = base(x)
    x = keras.layers.GlobalAveragePooling2D(name="global_average_pooling2d")(x)
    x = keras.layers.Dense(256, activation="relu", name="dense")(x)
    x = keras.layers.Dropout(0.5, name="dropout")(x)
    outputs = keras.layers.Dense(config.NUM_CLASSES, name="dense_1")(x)

    model = keras.Model(inputs=inputs, outputs=outputs)
    return model


def load_hybrid_model(model_path: str = None, device=None, num_classes: int = None):
    """
    Loads trained ResNet50 weights:
    1. First prioritizes model.tflite (24MB quantized weights, ultra-low memory, fast).
    2. Then checks for Keras weights files.
    3. Fallback to initial architecture.
    """
    model_dir = os.path.join(config.BASE_DIR, "models")
    tflite_path = os.path.join(model_dir, "model.tflite")

    # Priority 1: High performance, production-ready TFLite model with full weights
    if os.path.isfile(tflite_path):
        try:
            logger.info("Loading lightweight TFLite model from %s ...", tflite_path)
            wrapper = TFLiteModelWrapper(tflite_path)
            return wrapper, {
                "status": "full",
                "message": None,
                "checkpoint_classes": config.NUM_CLASSES,
                "architecture": "ResNet50 (TFLite 5-Class: model.weights (1))"
            }
        except Exception as e:
            logger.warning("Failed to load TFLite model: %s. Falling back to Keras...", e)

    # Priority 2: Full Keras checkpoint
    candidates = [
        os.path.join(model_dir, "model.weights (1).weights.h5"),
        os.path.join(model_dir, "model.weights (1).h5"),
        os.path.join(model_dir, "model.weights.h5"),
    ]

    target_weights = None
    for c in candidates:
        if os.path.isfile(c):
            target_weights = c
            break

    if target_weights and not target_weights.endswith(".weights.h5"):
        clean_name = target_weights.replace(".h5", ".weights.h5")
        if not os.path.isfile(clean_name):
            import shutil
            shutil.copyfile(target_weights, clean_name)
        target_weights = clean_name

    model = build_keras_resnet50_model()
    model._backend_type = "keras"

    if target_weights and os.path.isfile(target_weights):
        try:
            model.load_weights(target_weights)
            return model, {
                "status": "full",
                "message": None,
                "checkpoint_classes": config.NUM_CLASSES,
                "architecture": "ResNet50 (Keras 5-Class: model.weights (1))"
            }
        except Exception as e:
            raise ModelLoadError(f"Failed to load weights from {target_weights}: {e}")
    else:
        # Fallback graceful mode
        return model, {
            "status": "partial",
            "message": "Model running with initial weights. Upload weights to models/ for full inference.",
            "checkpoint_classes": config.NUM_CLASSES,
            "architecture": "ResNet50 (Keras 5-Class)"
        }
