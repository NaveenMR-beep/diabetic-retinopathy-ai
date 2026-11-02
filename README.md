# Diabetic Retinopathy AI Screening System

A hybrid EfficientNet-B0 + ResNet50 deep learning application for diabetic retinopathy
severity screening, with Grad-CAM explainability, a FastAPI backend, and a React +
Tailwind CSS frontend.

> **Disclaimer:** This system is intended for educational, research and screening-support
> purposes only. It does not provide a medical diagnosis and should not replace evaluation
> by a qualified ophthalmologist.

---

## Folder Structure

```
diabetic-retinopathy-ai/
├── backend/
│   ├── main.py              FastAPI app (loads model once, exposes /predict)
│   ├── model.py             HybridModel architecture + checkpoint loader
│   ├── inference.py         validation, preprocessing, prediction
│   ├── gradcam.py           Grad-CAM for both backbones, combined + overlaid
│   ├── config.py            ⚙️ all configuration, incl. preprocessing transform
│   ├── validate_setup.py    standalone sanity-check script (run this first!)
│   ├── requirements.txt
│   └── models/
│       └── hybrid_model_aptos_best.pth   ← put your trained weights here
│
├── frontend/
│   ├── src/
│   │   ├── components/      Header, UploadBox, ResultCards, GradCamCompare, etc.
│   │   ├── pages/           Home, Analysis, ModelInfo, About
│   │   ├── services/api.js  axios client for the backend
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 1. Place your trained model weights

Copy your trained checkpoint into the backend:

```
diabetic-retinopathy-ai/backend/models/hybrid_model_aptos_best.pth
```

(This is the file you trained and saved at
`/content/drive/MyDrive/hybrid_model_aptos_best.pth` — download it from Drive and
place it at the path above, or set the `MODEL_PATH` environment variable to point
to it anywhere else on disk.)

The architecture in `backend/model.py` matches your specification exactly
(EfficientNet-B0 + ResNet50 → concatenated 3328-d features → FC(3328→512) → ReLU →
Dropout(0.5) → FC(512→5)). **Do not edit this architecture** — if your checkpoint
doesn't match it, the app will tell you exactly which layers mismatch rather than
silently loading incorrect weights.

If your original training used different resize dimensions or normalization
statistics, edit the clearly-marked **PREPROCESSING** section in
`backend/config.py` — it's the single source of truth used everywhere in the app.

---

## 2. Backend setup

```bash
cd diabetic-retinopathy-ai/backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Validate before launching the full API (recommended)

This runs the exact checks required before wiring up the UI: model loads, a
sample image passes through, output shape is `[1, 5]`, softmax sums to ~1, and
Grad-CAM succeeds.

```bash
python validate_setup.py path/to/a/sample_retinal_image.jpg
```

You should see `All validation checks passed.` If it fails, the script prints
exactly which layer or step failed.

### Start the API

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The model loads once at startup (GPU is used automatically if available, CPU
otherwise). API docs: `http://localhost:8000/docs`.

---

## 3. Frontend setup

In a separate terminal:

```bash
cd diabetic-retinopathy-ai/frontend
npm install
cp .env.example .env     # defaults to http://localhost:8000 — edit if your backend runs elsewhere
npm run dev
```

Open `http://localhost:5173`.

---

## 4. Using the app

1. Go to **Analysis**.
2. Drag and drop (or choose) a retinal fundus image (JPG/JPEG/PNG).
3. Review the preview (filename, resolution), then click **Analyze Retinal Image**.
4. Review the results dashboard: predicted stage, confidence, AI screening risk
   level, side-by-side Grad-CAM comparison, class probability chart, and the
   "Understanding the Result" educational section with recommended next steps.

---

## API Reference

### `POST /predict`

Multipart form upload, field name `file`.

Response:

```json
{
  "predicted_class": "Moderate Diabetic Retinopathy",
  "class_index": 2,
  "confidence": 0.9142,
  "risk_level": "Moderate",
  "probabilities": {
    "No Diabetic Retinopathy": 0.021,
    "Mild Diabetic Retinopathy": 0.048,
    "Moderate Diabetic Retinopathy": 0.914,
    "Severe Diabetic Retinopathy": 0.013,
    "Proliferative Diabetic Retinopathy": 0.004
  },
  "original_image": "data:image/jpeg;base64,...",
  "gradcam_image": "data:image/jpeg;base64,...",
  "explanation": "...",
  "possible_findings": ["..."],
  "next_step": ["..."],
  "disclaimer": "...",
  "urgent_symptoms_notice": "..."
}
```

### `GET /health`

Reports whether the model is loaded, and the active device (`cpu`/`cuda`).

### `GET /model-info`

Static architecture description used by the frontend's Model Information page.

---

## Error Handling

The backend returns clear, human-readable messages (shown directly in the UI) for:

- non-image / corrupt / oversized uploads
- missing model weights file
- architecture / state-dict mismatches (which layers, exact shapes)
- unexpected output tensor shapes
- GPU unavailable (falls back to CPU automatically)
- general server errors

---

## Notes on scope

- Grad-CAM is computed from both `model.resnet.layer4[-1]` and
  `model.efficientnet.features[-1]`, resized to a common resolution, and averaged
  before being overlaid on the original image — per the hybrid architecture.
- Risk levels and the "Understanding the Result" copy are intentionally written as
  AI screening language ("the model predicts...", "features associated with...")
  and never as a definitive diagnosis.
- This is a prototype suitable for research demonstration or a final-year project;
  it has not been clinically validated.
