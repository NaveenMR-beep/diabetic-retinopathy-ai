import { Eye, ShieldAlert, Cpu } from "lucide-react";
import { DISCLAIMER_TEXT } from "../constants/diseaseInfo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-dark-950/90 backdrop-blur-xl mt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Eye size={18} />
            </div>
            <div>
              <p className="font-display font-bold text-white text-base tracking-wide">RetinaAI Screening System</p>
              <p className="text-xs text-slate-400">EfficientNet-B0 + ResNet50 Feature Fusion</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><Cpu size={14} className="text-cyan-400" /> PyTorch 2.3</span>
            <span>•</span>
            <span>FastAPI Backend</span>
            <span>•</span>
            <span>Grad-CAM Explainability</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-slate-400">
          <p className="max-w-3xl leading-relaxed flex gap-2">
            <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <span>{DISCLAIMER_TEXT}</span>
          </p>
          <p className="shrink-0 text-slate-400">
            &copy; {new Date().getFullYear()} RetinaAI • Educational & Research Prototype
          </p>
        </div>
      </div>
    </footer>
  );
}

