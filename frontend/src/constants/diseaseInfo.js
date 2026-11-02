// Mirrors backend/config.py DISEASE_INFO — kept here so the "Understanding
// the Result" section can render instantly from the /predict response
// without an extra round-trip, and as a fallback if fields are ever absent.

export const CLASS_NAMES = [
  "No Diabetic Retinopathy",
  "Mild Diabetic Retinopathy",
  "Moderate Diabetic Retinopathy",
  "Severe Diabetic Retinopathy",
  "Proliferative Diabetic Retinopathy",
];

export const SHORT_LABELS = ["No DR", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"];

export const RISK_LEVELS = {
  0: "Low",
  1: "Low / Early Changes",
  2: "Moderate",
  3: "High",
  4: "Very High",
};

export const SEVERITY_STYLE = {
  0: "normal",
  1: "normal",
  2: "caution",
  3: "warning",
  4: "warning",
};

export const DISCLAIMER_TEXT =
  "This AI system is intended for educational, research and screening-support purposes only. It does not provide a medical diagnosis and should not replace evaluation by a qualified ophthalmologist.";

export const URGENT_SYMPTOMS_TEXT =
  "If you experience sudden vision loss, flashes, floaters, severe visual changes, or other urgent eye symptoms, seek professional medical attention promptly.";

export const ANALYSIS_STEPS = [
  "Preprocessing image",
  "Extracting EfficientNet features",
  "Extracting ResNet50 features",
  "Combining deep features",
  "Generating prediction",
  "Generating explainability heatmap",
];
