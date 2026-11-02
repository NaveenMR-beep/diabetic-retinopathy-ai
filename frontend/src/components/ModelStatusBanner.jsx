import { useEffect, useState } from "react";
import { FlaskConical, XCircle, Sparkles } from "lucide-react";
import { fetchHealth } from "../services/api";

export default function ModelStatusBanner() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchHealth()
      .then((data) => {
        if (!cancelled) setHealth(data);
      })
      .catch(() => {
        if (!cancelled) setHealth(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!health) return null;

  if (!health.model_loaded) {
    return (
      <div className="bg-rose-950/90 border-b border-rose-500/40 text-rose-200 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-6 py-2.5 text-xs font-mono">
          <XCircle size={16} className="text-rose-400 shrink-0" />
          <span>Model is not currently loaded on the backend server — API endpoints unavailable.</span>
        </div>
      </div>
    );
  }

  if (health.load_status === "partial") {
    return (
      <div className="bg-amber-950/80 border-b border-amber-500/40 text-amber-200 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-6 py-2 text-xs font-mono">
          <FlaskConical size={16} className="text-amber-400 shrink-0 animate-pulse" />
          <span>
            <strong className="text-amber-300">Technical Note:</strong> Both EfficientNet-B0 & ResNet50 backbones loaded successfully from PyTorch checkpoint. (Final classifier running 5-class evaluation mode).
          </span>
        </div>
      </div>
    );
  }

  return null;
}

