import { useState } from "react";
import { Eye, Layers, SlidersHorizontal, Sparkles, Maximize2 } from "lucide-react";

export default function GradCamCompare({ originalImage, gradcamImage }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState("side"); // "side" or "slider"
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="card-glass p-6 border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-label">Explainable AI (XAI)</span>
            <span className="text-xs font-mono text-cyan-400">Layer4 + Features[-1]</span>
          </div>
          <h3 className="mt-1.5 text-xl font-bold font-display text-white">
            Visual Attention Map (Grad-CAM)
          </h3>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-dark-950 p-1">
          <button
            onClick={() => setViewMode("side")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "side" ? "bg-cyan-500 text-dark-950 font-bold shadow-glow" : "text-slate-400 hover:text-white"
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode("slider")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "slider" ? "bg-cyan-500 text-dark-950 font-bold shadow-glow" : "text-slate-400 hover:text-white"
            }`}
          >
            Interactive Slider
          </button>
        </div>
      </div>

      {/* Main Visual Display */}
      {viewMode === "side" ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Original Image */}
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-slate-700/80 bg-dark-950 group">
              <img
                src={originalImage}
                alt="Original retinal fundus"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 rounded-lg bg-dark-950/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-medium text-slate-300 border border-slate-700/60">
                Original Fundus Image
              </div>
            </div>
          </div>

          {/* Grad-CAM Heatmap Image */}
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-cyan-500/40 bg-dark-950 group shadow-glow">
              <img
                src={gradcamImage}
                alt="Grad-CAM attention map"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 rounded-lg bg-cyan-950/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/40 shadow-glow">
                AI Attention Heatmap
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Split Slider Mode */
        <div className="mt-6 space-y-3">
          <div className="relative h-96 w-full overflow-hidden rounded-xl border border-cyan-500/40 bg-dark-950 shadow-glow select-none">
            {/* Background: Grad-CAM heatmap */}
            <img
              src={gradcamImage}
              alt="Grad-CAM"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Foreground clipped: Original Image */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-cyan-400 shadow-glow-lg"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={originalImage}
                alt="Original Fundus"
                className="h-full w-full object-cover max-w-none"
                style={{ width: "100%", height: "100%" }}
              />
              <div className="absolute top-3 left-3 rounded-lg bg-dark-950/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-medium text-slate-200 border border-slate-700/60">
                Original
              </div>
            </div>
            <div className="absolute top-3 right-3 rounded-lg bg-cyan-950/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/40">
              Grad-CAM Heatmap
            </div>
          </div>

          {/* Range Slider Control */}
          <div className="flex items-center gap-4 px-2">
            <span className="text-xs font-mono text-slate-400">Original</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-xs font-mono text-cyan-400 font-semibold">Heatmap</span>
          </div>
        </div>
      )}

      {/* Heatmap Spectrum Legend */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Attention Scale:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-blue-400 font-mono">Low</span>
            <div className="h-3 w-32 rounded-full bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600 shadow-glow" />
            <span className="text-[10px] text-red-400 font-mono font-bold">High Focus</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
          Highlighted warm regions represent the optical feature maps driving the classifier head's output.
        </p>
      </div>
    </div>
  );
}

