import { useEffect, useState } from "react";
import { FileImage, ScanLine, HardDrive, Cpu, ArrowRight } from "lucide-react";

export default function ImagePreviewCard({ file, previewUrl, onAnalyze, disabled }) {
  const [resolution, setResolution] = useState(null);

  useEffect(() => {
    if (!previewUrl) return;
    const img = new Image();
    img.onload = () => setResolution(`${img.naturalWidth} × ${img.naturalHeight} px`);
    img.src = previewUrl;
  }, [previewUrl]);

  if (!file || !previewUrl) return null;

  const sizeKb = (file.size / 1024).toFixed(1);

  return (
    <div className="card-glass p-6 border-cyan-500/30 shadow-glow">
      <div className="flex flex-col gap-6 md:flex-row items-stretch">
        {/* Image Frame */}
        <div className="relative overflow-hidden rounded-xl border border-slate-700/80 bg-dark-950 md:w-72 md:shrink-0 group">
          <img
            src={previewUrl}
            alt="Retinal fundus preview"
            className="h-64 w-full object-cover md:h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 rounded-md bg-dark-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-semibold text-cyan-300 border border-slate-700/60">
            Fundus Input
          </div>
        </div>

        {/* Details & CTA */}
        <div className="flex flex-1 flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="badge-label">Selected Image Metadata</span>
              <span className="text-xs font-mono text-emerald-400">Ready for Analysis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-dark-850/80 p-3">
                <FileImage size={18} className="text-cyan-400 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-slate-400 text-[10px]">File Name</p>
                  <p className="font-semibold text-white truncate mt-0.5">{file.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-dark-850/80 p-3">
                <ScanLine size={18} className="text-cyan-400 shrink-0" />
                <div>
                  <p className="text-slate-400 text-[10px]">Resolution</p>
                  <p className="font-mono font-semibold text-white mt-0.5">{resolution || "Reading..."}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-dark-850/80 p-3">
                <HardDrive size={18} className="text-cyan-400 shrink-0" />
                <div>
                  <p className="text-slate-400 text-[10px]">File Size</p>
                  <p className="font-mono font-semibold text-white mt-0.5">{sizeKb} KB</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-dark-850/80 p-3">
                <Cpu size={18} className="text-cyan-400 shrink-0" />
                <div>
                  <p className="text-slate-400 text-[10px]">Target Model</p>
                  <p className="font-semibold text-white mt-0.5">EfficientNet + ResNet50</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary-glow w-full text-base py-3.5 shadow-glow"
            onClick={onAnalyze}
            disabled={disabled}
          >
            <span>Run Diagnostic AI Screening</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

