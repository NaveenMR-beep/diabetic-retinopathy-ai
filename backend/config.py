"""
config.py
---------
Central configuration for the Diabetic Retinopathy AI Screening backend.

Everything a clinician/engineer is likely to need to tune — model path,
preprocessing, class names, risk levels and patient-facing educational
copy — lives here so the rest of the codebase never hard-codes it.
"""

import os
import torch
from torchvision import transforms

# --------------------------------------------------------------------------
# 1. PATHS & DEVICE
# --------------------------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path to the trained hybrid model weights.
# Place your .pth file at backend/models/hybrid_model_aptos_best.pth
# (or override with the MODEL_PATH environment variable).
MODEL_PATH = os.environ.get(
    "MODEL_PATH",
    os.path.join(BASE_DIR, "models", "hybrid_model_aptos_best.pth"),
)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

NUM_CLASSES = 5

# --------------------------------------------------------------------------
# 2. ⚙️ IMAGE PREPROCESSING — EDIT THIS SECTION IF YOUR TRAINING PIPELINE
#    USED DIFFERENT TRANSFORMS. This is the ONLY place preprocessing is
#    defined; inference.py imports PREDICTION_TRANSFORM from here.
# --------------------------------------------------------------------------
#
# Default assumes standard ImageNet-style normalization at 224x224, which is
# what both EfficientNet-B0 and ResNet50 expect when trained from torchvision
# pretrained backbones. If your training notebook used different resize
# dimensions, mean/std, or additional augmentation-free transforms
# (e.g. CLAHE, circle-cropping of the fundus image), replace the Compose
# below. Do NOT change anything else in the app to adjust preprocessing.

IMAGE_SIZE = (224, 224)
NORMALIZE_MEAN = [0.485, 0.456, 0.406]
NORMALIZE_STD = [0.229, 0.224, 0.225]

PREDICTION_TRANSFORM = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=NORMALIZE_MEAN, std=NORMALIZE_STD),
])

# --------------------------------------------------------------------------
# 3. CLASS NAMES
# --------------------------------------------------------------------------

CLASS_NAMES = [
    "No Diabetic Retinopathy",
    "Mild Diabetic Retinopathy",
    "Moderate Diabetic Retinopathy",
    "Severe Diabetic Retinopathy",
    "Proliferative Diabetic Retinopathy",
]

SHORT_LABELS = ["No DR", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"]

# --------------------------------------------------------------------------
# 4. RISK LEVEL MAPPING (AI Screening Risk Level — not a clinical diagnosis)
# --------------------------------------------------------------------------

RISK_LEVELS = {
    0: "Low",
    1: "Low / Early Changes",
    2: "Moderate",
    3: "High",
    4: "Very High",
}

# Visual severity used by the frontend to decide card styling
# ("normal" vs. "warning") — Severe and Proliferative get the
# more noticeable warning treatment requested in the spec.
SEVERITY_STYLE = {
    0: "normal",
    1: "normal",
    2: "caution",
    3: "warning",
    4: "warning",
}

# --------------------------------------------------------------------------
# 5. EDUCATIONAL CONTENT — "Understanding the Result"
#    Kept deliberately conservative: screening language only, never a
#    definitive diagnostic claim.
# --------------------------------------------------------------------------

DISEASE_INFO = {
    0: {
        "summary": "The model did not identify strong features associated with diabetic retinopathy in this image.",
        "possible_findings": [
            "No significant retinal damage identified by the model",
        ],
        "next_steps": [
            "Continue routine diabetic eye examinations",
            "Maintain good glucose, blood pressure and lipid control",
        ],
    },
    1: {
        "summary": "The AI model predicts features most consistent with an early stage of retinal damage related to diabetes.",
        "possible_findings": [
            "Small microaneurysms",
            "Tiny retinal vascular changes",
        ],
        "next_steps": [
            "Routine ophthalmology evaluation",
            "Monitor blood glucose",
            "Follow clinician-recommended eye examination schedule",
        ],
    },
    2: {
        "summary": "The AI model predicts features consistent with more noticeable retinal vascular changes.",
        "possible_findings": [
            "Microaneurysms",
            "Retinal hemorrhages",
            "Hard exudates",
            "Vascular abnormalities",
        ],
        "next_steps": [
            "Ophthalmology consultation",
            "Retinal examination",
            "Control diabetes, blood pressure and cholesterol",
            "Follow-up based on ophthalmologist advice",
        ],
    },
    3: {
        "summary": "The AI model predicts features consistent with advanced retinal vascular damage.",
        "possible_findings": [
            "Extensive retinal hemorrhage",
            "Venous abnormalities",
            "Significant retinal ischemic changes",
        ],
        "next_steps": [
            "Prompt ophthalmologist or retina specialist evaluation",
            "Detailed retinal examination",
            "Appropriate treatment planning if confirmed",
        ],
    },
    4: {
        "summary": "The AI model predicts an advanced stage in which abnormal new blood vessels may develop because of poor retinal blood supply.",
        "possible_findings": [
            "Neovascularization",
            "Retinal bleeding",
            "Vitreous hemorrhage",
            "Risk of significant vision loss",
        ],
        "next_steps": [
            "Prompt evaluation by an ophthalmologist or retinal specialist",
            "Further diagnostic retinal examination",
            "Treatment may be required if the diagnosis is clinically confirmed",
        ],
    },
}

# --------------------------------------------------------------------------
# 6. GRAD-CAM SETTINGS
# --------------------------------------------------------------------------

GRADCAM_ALPHA = 0.45          # overlay blend strength
GRADCAM_COLORMAP = "JET"      # OpenCV colormap name

# --------------------------------------------------------------------------
# 7. SAFETY / DISCLAIMER COPY (reused by API responses and frontend)
# --------------------------------------------------------------------------

DISCLAIMER_TEXT = (
    "This AI system is intended for educational, research and screening-support "
    "purposes only. It does not provide a medical diagnosis and should not "
    "replace evaluation by a qualified ophthalmologist."
)

URGENT_SYMPTOMS_TEXT = (
    "If you experience sudden vision loss, flashes, floaters, severe visual "
    "changes, or other urgent eye symptoms, seek professional medical "
    "attention promptly."
)

# --------------------------------------------------------------------------
# 8. CORS — frontend origins allowed to call this API in development
# --------------------------------------------------------------------------

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
