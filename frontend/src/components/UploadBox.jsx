import { useCallback, useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, FileCheck2 } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function UploadBox({ onFileSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const validateAndEmit = useCallback(
    (file) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Unsupported file format. Please upload a high-resolution JPG, JPEG, or PNG fundus image.");
        return;
      }
      setError("");
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndEmit(file);
  };

  // Helper to generate a sample canvas image for quick testing
  const handleUseSampleImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Draw realistic fundus fundus-like background gradient
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
    grad.addColorStop(0, "#d97706"); // Optic disc orange center
    grad.addColorStop(0.3, "#991b1b"); // Deep reddish fundus body
    grad.addColorStop(1, "#450a0a"); // Dark peripheral border
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Draw optic disc
    ctx.beginPath();
    ctx.arc(170, 256, 45, 0, Math.PI * 2);
    ctx.fillStyle = "#fef3c7";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 20;
    ctx.fill();

    // Draw blood vessels
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#7f1d1d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(170, 256);
    ctx.quadraticCurveTo(240, 150, 400, 100);
    ctx.moveTo(170, 256);
    ctx.quadraticCurveTo(280, 320, 450, 400);
    ctx.moveTo(170, 256);
    ctx.quadraticCurveTo(120, 140, 50, 80);
    ctx.stroke();

    // Convert to File
    canvas.toBlob((blob) => {
      const sampleFile = new File([blob], "sample_retinal_fundus.jpg", { type: "image/jpeg" });
      onFileSelected(sampleFile);
    }, "image/jpeg");
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-all duration-300 overflow-hidden ${
          isDragging
            ? "border-cyan-400 bg-cyan-950/40 shadow-glow"
            : "border-slate-800 bg-dark-900/60 hover:border-cyan-500/50 hover:bg-dark-900/80 hover:shadow-glow/50"
        }`}
      >
        {/* Background ambient light */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Animated Icon Circle */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-dark-850 border border-slate-700/80 text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500 group-hover:shadow-glow transition-all duration-300 mb-4">
          <UploadCloud size={36} strokeWidth={1.8} className="group-hover:-translate-y-1 transition-transform duration-300" />
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-dark-950">
            <Sparkles size={14} />
          </div>
        </div>

        <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
          Upload Retinal Fundus Image
        </h3>
        <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
          Drag and drop your fundus photograph here, or browse local files
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono font-medium text-slate-400">
          <span className="rounded-md border border-slate-800 bg-dark-950 px-2 py-1">JPG</span>
          <span className="rounded-md border border-slate-800 bg-dark-950 px-2 py-1">JPEG</span>
          <span className="rounded-md border border-slate-800 bg-dark-950 px-2 py-1">PNG</span>
          <span>•</span>
          <span>Max File Size: 15MB</span>
        </div>

        <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
          <button
            type="button"
            className="btn-primary-glow text-sm py-2.5 px-5"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            <ImageIcon size={16} /> Choose Image File
          </button>

          <button
            type="button"
            className="btn-secondary-glow text-sm py-2.5 px-4"
            onClick={(e) => {
              e.stopPropagation();
              handleUseSampleImage();
            }}
          >
            <Sparkles size={15} className="text-amber-400" />
            <span>Try Sample Fundus</span>
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          onChange={(e) => validateAndEmit(e.target.files?.[0])}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-300">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

