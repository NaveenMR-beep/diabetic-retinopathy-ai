import { useState } from "react";
import { AlertCircle, FlaskConical, RotateCcw, Sparkles, SlidersHorizontal, Activity } from "lucide-react";
import UploadBox from "../components/UploadBox";
import ImagePreviewCard from "../components/ImagePreviewCard";
import LoadingAnalysis from "../components/LoadingAnalysis";
import ResultCards from "../components/ResultCards";
import GradCamCompare from "../components/GradCamCompare";
import ProbabilityChart from "../components/ProbabilityChart";
import DiseaseExplanation from "../components/DiseaseExplanation";
import Disclaimer from "../components/Disclaimer";
import { analyzeRetinalImage } from "../services/api";

export default function Analysis() {
  const [stage, setStage] = useState("idle");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setStage("preview");
    setErrorMessage("");
  };

  const handleAnalyze = async () => {
    setStage("loading");
    try {
      const data = await analyzeRetinalImage(file);
      setResult(data);
      setStage("results");
    } catch (err) {
      setErrorMessage(err.message || "Unable to process this image. Please try again.");
      setStage("error");
    }
  };

  const handleReset = () => {
    setStage("idle");
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage("");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-label">Diagnostic Workspace</span>
            <span className="text-xs font-mono text-cyan-400">Live AI Screening</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold font-display text-white">
            Retinal Image Diagnostic Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Upload a fundus photograph to generate instant multi-class predictions and Grad-CAM visual heatmaps.
          </p>
        </div>

        {/* Diagnostic Stage Indicator Pills */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-dark-900/80 p-2 rounded-xl border border-slate-800">
          <span className={`px-2.5 py-1 rounded-lg ${stage === "idle" ? "bg-cyan-500 text-dark-950 font-bold" : "text-slate-400"}`}>1. Upload</span>
          <span>&rarr;</span>
          <span className={`px-2.5 py-1 rounded-lg ${stage === "preview" ? "bg-cyan-500 text-dark-950 font-bold" : "text-slate-400"}`}>2. Confirm</span>
          <span>&rarr;</span>
          <span className={`px-2.5 py-1 rounded-lg ${stage === "loading" ? "bg-cyan-500 text-dark-950 font-bold" : "text-slate-400"}`}>3. Process</span>
          <span>&rarr;</span>
          <span className={`px-2.5 py-1 rounded-lg ${stage === "results" ? "bg-emerald-500 text-dark-950 font-bold" : "text-slate-400"}`}>4. Report</span>
        </div>
      </div>

      <div className="space-y-8">
        {stage === "idle" && <UploadBox onFileSelected={handleFileSelected} />}

        {(stage === "preview" || stage === "loading") && (
          <ImagePreviewCard
            file={file}
            previewUrl={previewUrl}
            onAnalyze={handleAnalyze}
            disabled={stage === "loading"}
          />
        )}

        {stage === "loading" && <LoadingAnalysis />}

        {stage === "error" && (
          <div className="card-glass border-rose-500/40 bg-rose-950/30 p-6 shadow-glow-rose flex items-start gap-4">
            <AlertCircle size={24} className="shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-3">
              <p className="text-base font-bold text-rose-300">Diagnostic Execution Failed</p>
              <p className="text-sm text-rose-200">{errorMessage}</p>
              <button onClick={handleReset} className="btn-secondary-glow mt-2 text-xs py-2 px-4">
                <RotateCcw size={14} /> Try Another Fundus Image
              </button>
            </div>
          </div>
        )}

        {stage === "results" && result && (
          <div className="space-y-8 animate-fadeIn">
            {result.model_notice && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs backdrop-blur-md">
                <FlaskConical size={18} className="shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-300">Technical Calibration Note</p>
                  <p className="mt-1 text-amber-200 leading-relaxed">{result.model_notice}</p>
                </div>
              </div>
            )}

            <ResultCards result={result} />
            <GradCamCompare originalImage={result.original_image} gradcamImage={result.gradcam_image} />
            <ProbabilityChart probabilities={result.probabilities} />
            <DiseaseExplanation result={result} />
            <Disclaimer />

            <div className="flex justify-center pt-4">
              <button onClick={handleReset} className="btn-secondary-glow text-base py-3 px-8 shadow-glow">
                <RotateCcw size={18} className="text-cyan-400" />
                <span>Analyze Another Retinal Fundus</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

