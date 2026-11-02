"""
gradcam.py
----------
Grad-CAM explainability supporting both Keras/TensorFlow ResNet50 and PyTorch models.
"""

import cv2
import numpy as np


def overlay_heatmap_on_image(image_rgb: np.ndarray, heatmap: np.ndarray, alpha: float = 0.4) -> np.ndarray:
    """
    Overlays a [0, 1] float heatmap onto an RGB image uint8 array [H, W, 3].
    """
    heatmap_resized = cv2.resize(heatmap, (image_rgb.shape[1], image_rgb.shape[0]))
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    color_map = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    color_map = cv2.cvtColor(color_map, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(image_rgb, 1 - alpha, color_map, alpha, 0)
    return overlay


def generate_gradcam(model, input_tensor, target_class: int, device=None) -> np.ndarray:
    """
    Computes a Grad-CAM heatmap for Keras or PyTorch model.
    """
    backend_type = getattr(model, "_backend_type", "keras")

    if backend_type == "keras":
        import tensorflow as tf
        import keras

        # Preprocessing lambda and resnet extractor
        lambda_layer = model.get_layer("lambda")
        resnet = model.get_layer("resnet50")
        conv_layer = resnet.get_layer("conv5_block3_out")

        feature_extractor = keras.Model(inputs=resnet.input, outputs=conv_layer.output)

        head_input = keras.Input(shape=conv_layer.output.shape[1:])
        h = head_input
        for name in ["global_average_pooling2d", "dense", "dropout", "dense_1"]:
            h = model.get_layer(name)(h)
        head_model = keras.Model(inputs=head_input, outputs=h)

        if hasattr(input_tensor, "cpu"):
            inp_np = input_tensor.permute(0, 2, 3, 1).cpu().numpy()
        else:
            inp_np = np.array(input_tensor, dtype=np.float32)

        preprocessed = lambda_layer(inp_np)

        with tf.GradientTape() as tape:
            conv_out = feature_extractor(preprocessed)
            tape.watch(conv_out)
            preds = head_model(conv_out)
            target_score = preds[:, target_class]

        grads = tape.gradient(target_score, conv_out)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        cam = tf.reduce_sum(tf.multiply(pooled_grads, conv_out), axis=-1)[0].numpy()

        cam = np.maximum(cam, 0)
        max_val = np.max(cam)
        if max_val > 0:
            cam = cam / max_val
        else:
            # Fallback activation intensity map
            cam = np.mean(conv_out[0].numpy(), axis=-1)
            cam = np.maximum(cam, 0)
            if np.max(cam) > 0:
                cam = cam / np.max(cam)
            else:
                cam = np.ones((7, 7), dtype=np.float32) * 0.5
        return cam

    else:
        # PyTorch
        import torch
        import torch.nn.functional as F

        class _LayerCapture:
            def __init__(self, layer):
                self.activations = None
                self.gradients = None
                self._fwd = layer.register_forward_hook(lambda m, i, o: setattr(self, "activations", o.detach()))
                self._bwd = layer.register_full_backward_hook(lambda m, gi, go: setattr(self, "gradients", go[0].detach()))

            def remove(self):
                self._fwd.remove()
                self._bwd.remove()

        resnet_layer = model.resnet.layer4[-1]
        capture = _LayerCapture(resnet_layer)

        model.eval()
        outputs = model(input_tensor)
        score = outputs[:, target_class]
        model.zero_grad()
        score.backward(retain_graph=False)

        weights = capture.gradients.mean(dim=(2, 3), keepdim=True)
        weighted = (weights * capture.activations).sum(dim=1, keepdim=False)
        cam = F.relu(weighted).squeeze(0).cpu().numpy()
        capture.remove()

        if cam.max() > cam.min():
            cam = (cam - cam.min()) / (cam.max() - cam.min())
        else:
            cam = np.zeros_like(cam)
        return cam
