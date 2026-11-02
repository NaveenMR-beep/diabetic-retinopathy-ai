import { ArrowDown, Image as ImageIcon, Layers, Sigma, Cpu, Sparkles, Database, GitMerge } from "lucide-react";

function Block({ children, variant = "default", sub }) {
  const styles = {
    default: "border-slate-800 bg-dark-900/80 text-slate-200 shadow-glass",
    accent: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-glow",
    cyan: "border-teal-500/40 bg-teal-500/10 text-teal-300 shadow-glow",
    gradient: "border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-glow-lg",
  };
  return (
    <div className={`rounded-xl border p-4 text-center transition-all duration-300 hover:scale-[1.02] ${styles[variant]}`}>
      <p className="text-sm font-semibold">{children}</p>
      {sub && <p className="text-[11px] font-mono opacity-80 mt-0.5">{sub}</p>}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown size={18} className="text-cyan-400 animate-pulse" />
    </div>
  );
}

export default function ModelInfo() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-12">
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="badge-label">Architecture Specification</span>
          <span className="text-xs font-mono text-cyan-400">PyTorch Implementation</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold font-display text-white">
          Hybrid Deep Learning Feature Fusion
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400 leading-relaxed">
          The system implements a late feature-level fusion strategy: the retinal fundus image is fed simultaneously through two complementary convolutional backbones, and their pooled feature representations are concatenated into a unified 3,328-dimensional embedding before classification.
        </p>
      </div>

      {/* Architecture Flow Visualizer */}
      <div className="card-glass p-8 border-slate-800">
        <div className="text-center mb-8">
          <span className="badge-label">Pipeline Workflow</span>
          <h3 className="mt-2 text-xl font-bold text-white font-display">Dual Backbone Feature Concatenation</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* EfficientNet Branch */}
          <div className="space-y-2">
            <Block variant="gradient" sub="Input RGB 224×224 / 512×512">Input Retinal Image</Block>
            <Arrow />
            <Block variant="accent" sub="Pretrained PyTorch Model">EfficientNet-B0 Backbone</Block>
            <Arrow />
            <Block sub="AdaptiveAvgPool2d (1280-D)">EfficientNet Feature Vector = 1,280</Block>
          </div>

          {/* ResNet Branch */}
          <div className="space-y-2">
            <Block variant="gradient" sub="Input RGB 224×224 / 512×512">Input Retinal Image</Block>
            <Arrow />
            <Block variant="cyan" sub="Pretrained PyTorch Model">ResNet50 Backbone</Block>
            <Arrow />
            <Block sub="AdaptiveAvgPool2d (2048-D)">ResNet50 Feature Vector = 2,048</Block>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <ArrowDown size={22} className="text-cyan-400 animate-bounce" />
        </div>

        {/* Fusion Classifier Head */}
        <div className="mx-auto max-w-md space-y-2 mt-2">
          <Block variant="gradient" sub="1280 + 2048 Dimensions">Concatenate Embeddings (3,328-D)</Block>
          <Arrow />
          <Block variant="accent" sub="Linear Transformation">Fully Connected Layer (3,328 &rarr; 512)</Block>
          <Arrow />
          <Block sub="Activation & Regularization">ReLU + Dropout (p = 0.5)</Block>
          <Arrow />
          <Block variant="gradient" sub="Multiclass Softmax Output">5 Severity Stage Probabilities</Block>
        </div>
      </div>

      {/* Core Tech Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-6 border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
            <GitMerge size={20} />
          </div>
          <h3 className="text-base font-bold text-white font-display">Feature Fusion Strategy</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Rather than averaging prediction probabilities, combining raw feature vectors allows the joint classification head to model high-order correlations between micro and macro features.
          </p>
        </div>

        <div className="card-glass p-6 border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-4">
            <Sigma size={20} />
          </div>
          <h3 className="text-base font-bold text-white font-display">3,328-D Joint Space</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Captures 1,280 inverted residual block features alongside 2,048 deep bottleneck features, producing a highly descriptive lesion representation space.
          </p>
        </div>

        <div className="card-glass p-6 border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-4">
            <Sparkles size={20} />
          </div>
          <h3 className="text-base font-bold text-white font-display">Dual Grad-CAM Fusion</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Gradients are backpropagated into both <code className="text-cyan-300">EfficientNet.features[-1]</code> and <code className="text-cyan-300">ResNet.layer4[-1]</code> to overlay comprehensive visual attention maps.
          </p>
        </div>
      </div>
    </div>
  );
}

