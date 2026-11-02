"""
model.py
--------
Model loader supporting Keras/TensorFlow ResNet50 (5-class DR).
"""

import os
import glob
import config


class ModelLoadError(Exception):
    """Raised when the checkpoint cannot be loaded into the model."""
    pass


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
    Loads trained Keras ResNet50 weights.
    Prioritizes model.weights (1).weights.h5 / model.weights (1).h5.
    If no weights file is found on disk, initializes the architecture
    so the server starts and serves /health and /model-info without crashing.
    """
    model_dir = os.path.join(config.BASE_DIR, "models")

    # Candidates for weights file
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

    # If an .h5 exists but not .weights.h5, copy it
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
        # Fallback graceful mode: model loaded without weights so server stays healthy
        return model, {
            "status": "partial",
            "message": "Model running with initial weights. Upload weights to models/ for full inference.",
            "checkpoint_classes": config.NUM_CLASSES,
            "architecture": "ResNet50 (Keras 5-Class)"
        }
