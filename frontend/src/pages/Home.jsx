import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Activity, Eye, ScanEye, ShieldCheck, ArrowRight, Layers, Cpu, Zap, 
  CheckCircle2, AlertTriangle, ChevronRight, Sparkles 
} from "lucide-react";
import Disclaimer from "../components/Disclaimer";

const stats = [
  { value: "3,328", label: "Feature Dimensions", sub: "1280 (EffNet) + 2048 (ResNet)" },
  { value: "5 Stages", label: "Severity Grading", sub: "APTOS / ETDRS Standard" },
  { value: "< 1.2s", label: "Inference Speed", sub: "FastAPI + PyTorch Engine" },
  { value: "Grad-CAM", label: "Explainability", sub: "Dual Layer Heatmap Overlay" },
];

const features = [
  {
    icon: ScanEye,
    title: "Dual Deep Learning Backbone",
    text: "Combines fine-grained micro-lesion detection from EfficientNet-B0 with macro-structural contextual awareness from ResNet50.",
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Eye,
    title: "Visual Explainable AI (Grad-CAM)",
    text: "Generates intuitive heatmaps highlighting exact retinal regions (hemorrhages, exudates, cotton wool spots) influencing the prediction.",
    color: "from-teal-500/20 to-emerald-500/20",
    iconColor: "text-teal-400",
  },
  {
    icon: ShieldCheck,
    title: "Clinical Decision Support",
    text: "Provides instant severity risk stratification and actionable clinical recommendations to assist ophthalmology workflows.",
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-400",
  },
];

const stages = [
  { title: "No DR", grade: "Stage 0", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400", desc: "Normal retinal vasculature, no microaneurysms detected." },
  { title: "Mild DR", grade: "Stage 1", color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400", desc: "Microaneurysms only present in small retinal capillaries." },
  { title: "Moderate DR", grade: "Stage 2", color: "border-amber-500/40 bg-amber-500/10 text-amber-400", desc: "More microaneurysms, hard exudates, or venous beading." },
  { title: "Severe DR", grade: "Stage 3", color: "border-rose-500/40 bg-rose-500/10 text-rose-400", desc: ">20 intraretinal hemorrhages per quadrant or venous beading." },
  { title: "Proliferative DR", grade: "Stage 4", color: "border-red-600/50 bg-red-500/20 text-red-400", desc: "Neovascularization or vitreous/preretinal hemorrhage." },
];

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 backdrop-blur-md">
                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                <span>Next-Gen Ophthalmic AI Diagnostics</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl font-display leading-[1.1]">
                AI-Powered <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Diabetic Retinopathy</span> Screening
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl font-normal">
                Upload retinal fundus photographs to analyze diabetic retinopathy severity in seconds with <strong className="text-white">hybrid feature fusion</strong> and <strong className="text-cyan-400">Grad-CAM visual explainability</strong>.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/analysis" className="btn-primary-glow group text-base">
                  <span>Start Screening Analysis</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link to="/model-info" className="btn-secondary-glow text-base">
                  <Layers size={18} className="text-cyan-400" />
                  <span>Architecture Docs</span>
                </Link>
              </div>

              {/* Security & Speed badges */}
              <div className="flex items-center gap-6 pt-4 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Private & Client-Safe Processing</span>
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-cyan-400" /> Instant GPU/CPU Inference</span>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md card-glass p-6 text-left border-cyan-500/30 shadow-glow">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300">Live AI Engine Active</span>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-800/80 px-2 py-0.5 rounded text-slate-400">PyTorch 2.3</span>
                </div>

                <div className="mt-5 space-y-4">
                  {/* Fundus Visual Preview Mockup */}
                  <div className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-dark-950 h-52 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-rose-900/10 to-transparent" />
                    <div className="relative z-10 text-center space-y-2 p-4">
                      <div className="mx-auto h-20 w-20 rounded-full border-2 border-cyan-400/60 bg-cyan-950/40 flex items-center justify-center shadow-glow animate-pulse-glow">
                        <Eye size={36} className="text-cyan-400" />
                      </div>
                      <p className="text-xs font-mono text-cyan-300 font-medium">Click Analysis to Upload Fundus Image</p>
                    </div>
                    {/* Scanning Beam Animation */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line shadow-glow" />
                  </div>

                  {/* Quick Feature breakdown */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-dark-850/80 border border-slate-800">
                      <p className="text-slate-400">Backbone 1</p>
                      <p className="font-semibold text-white mt-0.5">EfficientNet-B0</p>
                    </div>
                    <div className="p-3 rounded-xl bg-dark-850/80 border border-slate-800">
                      <p className="text-slate-400">Backbone 2</p>
                      <p className="font-semibold text-white mt-0.5">ResNet50</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div key={item.label} className="card-glass p-5 text-center group hover:border-cyan-500/40 transition-all duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold font-display bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {item.value}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-200">{item.label}</p>
              <p className="mt-1 text-[11px] text-slate-400">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-label">Core Capabilities</span>
          <h2 className="mt-3 text-3xl font-bold font-display heading-gradient">Engineered for Clinical Precision</h2>
          <p className="mt-2 text-sm text-slate-400">Dual-network feature extraction paired with spatial visual interpretability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, text, color, iconColor }) => (
            <div key={title} className="card-glass-hover p-6 flex flex-col justify-between">
              <div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} border border-slate-700/50 ${iconColor} mb-5`}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-white font-display">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Retinal Severity Explorer */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="card-glass p-8 border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div>
              <span className="badge-label">ETDRS Classification Standard</span>
              <h2 className="mt-2 text-2xl font-bold text-white font-display">5 Diabetic Retinopathy Severity Stages</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">The model evaluates fundus images against standard clinical severity scales.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {stages.map((st, idx) => (
              <button
                key={st.title}
                onClick={() => setActiveStage(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                  activeStage === idx
                    ? `${st.color} shadow-glow scale-[1.02]`
                    : "border-slate-800 bg-dark-850/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span>{st.grade}</span>
                  {activeStage === idx && <ChevronRight size={14} />}
                </div>
                <p className="font-semibold text-sm text-white">{st.title}</p>
                <p className="mt-2 text-xs leading-relaxed opacity-90 line-clamp-3">{st.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="mx-auto max-w-7xl px-6">
        <Disclaimer />
      </section>
    </div>
  );
}

