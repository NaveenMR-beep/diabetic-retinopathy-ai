"""
model.py
--------
Model loader supporting Keras/TensorFlow ResNet50 (5-class DR) and PyTorch models.
Specifically loads model.weights (1) / model.weights (1).weights.h5.
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
    Loads trained weights.
    Prioritizes model.weights (1).weights.h5 / model.weights (1).h5,
    falling back to config.json or PyTorch checkpoints.
    """
    model_dir = os.path.join(config.BASE_DIR, "models")

    # Check for model.weights (1)
    target_weights = os.path.join(model_dir, "model.weights (1).weights.h5")
    raw_h5 = os.path.join(model_dir, "model.weights (1).h5")

    if not os.path.isfile(target_weights) and os.path.isfile(raw_h5):
        import shutil
        shutil.copyfile(raw_h5, target_weights)

    if os.path.isfile(target_weights):
        try:
            model = build_keras_resnet50_model()
            model.load_weights(target_weights)
            model._backend_type = "keras"

            return model, {
                "status": "full",
                "message": None,
                "checkpoint_classes": config.NUM_CLASSES,
                "architecture": "ResNet50 (Keras 5-Class: model.weights (1))"
            }
        except Exception as e:
            raise ModelLoadError(f"Failed to load weights from {target_weights}: {e}")

    # Fallback to PyTorch
    import torch
    import torch.nn as nn
    from torchvision import models

    model_path = model_path or config.MODEL_PATH
    device = device or config.DEVICE
    num_classes = num_classes or config.NUM_CLASSES

    if not os.path.isfile(model_path):
        raise ModelLoadError(
            f"No valid model weights found in {model_dir}. Expected model.weights (1).h5 or .pth file."
        )

    class PyTorchHybrid(nn.Module):
        def __init__(self, num_cls=5):
            super().__init__()
            self.efficientnet = models.efficientnet_b0(weights=None)
            self.efficientnet.classifier = nn.Identity()
            self.resnet = models.resnet50(weights=None)
            self.resnet.fc = nn.Identity()
            self.classifier = nn.Sequential(
                nn.Linear(1280 + 2048, 512),
                nn.ReLU(),
                nn.Dropout(0.5),
                nn.Linear(512, num_cls)
            )

        def forward(self, x):
            f1 = self.efficientnet(x)
            f2 = self.resnet(x)
            fused = torch.cat((f1, f2), dim=1)
            return self.classifier(fused)

    model = PyTorchHybrid(num_classes=num_classes)
    checkpoint = torch.load(model_path, map_location=device)
    state_dict = checkpoint.get("state_dict", checkpoint.get("model_state_dict", checkpoint))

    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    model._backend_type = "pytorch"

    return model, {"status": "full", "message": None, "checkpoint_classes": num_classes}
