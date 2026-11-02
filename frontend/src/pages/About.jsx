import { Eye, ShieldCheck, Cpu, Code2, Database, Layers } from "lucide-react";
import Disclaimer from "../components/Disclaimer";

const techStack = [
  { category: "Deep Learning Engine", tech: "PyTorch 2.3", detail: "EfficientNet-B0 + ResNet50 Dual Backbones" },
  { category: "API Microservice", tech: "FastAPI + Uvicorn", detail: "Single-load PyTorch Evaluation Server" },
  { category: "Frontend Interface", tech: "React 18 + Vite", detail: "Tailwind CSS Dark Theme & Glassmorphism" },
  { category: "Explainability", tech: "Grad-CAM (PyTorch)", detail: "Spatial Feature Attention Map Overlay" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="badge-label">Project Documentation</span>
          <span className="text-xs font-mono text-cyan-400">Research & Screening Prototype</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold font-display text-white">
          About RetinaAI Screening System
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
          An end-to-end deep learning platform created for automated screening support and explainable severity grading of diabetic retinopathy.
        </p>
      </div>

      <div className="card-glass p-8 border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Eye size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">System Purpose & Design Philosophy</h2>
            <p className="text-xs text-slate-400">Combining High Sensitivity Feature Extraction with Transparency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-300">
          <div className="p-4 rounded-xl bg-dark-850/60 border border-slate-800 space-y-2">
            <p className="font-semibold text-cyan-300 text-sm">Dual Backbone Feature Engineering</p>
            <p>
              By passing fundus images simultaneously through EfficientNet-B0 (optimized for lightweight fine feature extraction) and ResNet50 (renowned for residual skip-connections and macro context), the model captures both microvascular changes and general retinal architecture.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-850/60 border border-slate-800 space-y-2">
            <p className="font-semibold text-cyan-300 text-sm">Explainable AI (Grad-CAM Integration)</p>
            <p>
              Black-box AI models pose clinical trust challenges. RetinaAI solves this by computing Class Activation Maps from the final convolutional layers of both backbones, displaying exact pixel regions that drove the model's confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-display text-white">System Technical Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((item) => (
            <div key={item.category} className="card-glass p-5 border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{item.category}</span>
              <p className="font-bold text-base text-white mt-1 font-display">{item.tech}</p>
              <p className="mt-1.5 text-xs text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

