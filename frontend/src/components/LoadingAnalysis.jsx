import { useEffect, useState } from "react";
import { Check, Loader2, Cpu, Scan, Sparkles } from "lucide-react";
import { ANALYSIS_STEPS } from "../constants/diseaseInfo";

export default function LoadingAnalysis() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex >= ANALYSIS_STEPS.length - 1) return;

    const timer = setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, ANALYSIS_STEPS.length - 1));
    }, 750);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  return (
    <div className="card-glass p-8 border-cyan-500/30 shadow-glow relative overflow-hidden">
      {/* Scanning laser line overlay */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line shadow-glow" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-glow">
            <Loader2 size={24} className="animate-spin text-cyan-400" />
            <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-white">Analyzing Retinal Fundus...</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Running Hybrid Deep Learning Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300">
          <Cpu size={14} className="text-cyan-400" />
          <span>Concatenating 3,328-D Vectors</span>
        </div>
      </div>

      <ul className="mt-8 space-y-4">
        {ANALYSIS_STEPS.map((step, idx) => {
          const state = idx < stepIndex ? "done" : idx === stepIndex ? "active" : "pending";
          return (
            <li
              key={step}
              className={`flex items-center gap-3.5 text-sm p-3 rounded-xl border transition-all duration-300 ${
                state === "done"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-slate-200"
                  : state === "active"
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-200 shadow-glow/30"
                  : "border-slate-800/60 bg-dark-850/40 text-slate-400"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border font-mono text-xs transition-all duration-300 ${
                  state === "done"
                    ? "border-emerald-500 bg-emerald-500 text-dark-950 font-bold"
                    : state === "active"
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                    : "border-slate-700 bg-dark-900 text-slate-500"
                }`}
              >
                {state === "done" ? (
                  <Check size={14} strokeWidth={3} />
                ) : state === "active" ? (
                  <Loader2 size={14} className="animate-spin text-cyan-400" />
                ) : (
                  idx + 1
                )}
              </span>
              <span className={`font-medium ${state === "active" ? "text-cyan-300" : ""}`}>
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

