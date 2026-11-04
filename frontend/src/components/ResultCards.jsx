import { Activity, Cpu, Gauge, ShieldAlert, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";

const severityStyles = {
  normal: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-glow-emerald",
  caution: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  warning: "border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-glow-rose",
};

const severityIcons = {
  normal: CheckCircle,
  caution: AlertTriangle,
  warning: AlertOctagon,
};

function Card({ icon: Icon, label, value, sub, style = "normal", confidence }) {
  const isSeverity = style in severityStyles;
  const cardBorder = isSeverity ? severityStyles[style] : "border-slate-800 bg-dark-900/70 text-white";

  return (
    <div className={`card-glass p-5 flex flex-col justify-between border ${cardBorder}`}>
      <div>
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">{label}</span>
          <Icon size={18} className="text-cyan-400" />
        </div>
        <p className="text-2xl font-extrabold font-display tracking-tight text-white mt-1">
          {value}
        </p>
        {sub && <p className="mt-1.5 text-xs text-slate-400 font-medium">{sub}</p>}
      </div>

      {confidence !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Certainty Gauge</span>
            <span className="text-cyan-400 font-bold">{confidence.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-dark-950 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-glow transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(5, confidence))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultCards({ result }) {
  const severityStyle = result.severity_style || "normal";
  const confidencePct = result.confidence ? result.confidence * 100 : 0;
  const SeverityIcon = severityIcons[severityStyle] || Activity;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        icon={SeverityIcon}
        label="Predicted Diagnosis"
        value={result.predicted_class}
        style={severityStyle}
      />
      <Card
        icon={Gauge}
        label="Confidence Score"
        value={`${confidencePct.toFixed(1)}%`}
        confidence={confidencePct}
      />
      <Card
        icon={ShieldAlert}
        label="Screening Risk Level"
        value={result.risk_level}
        style={severityStyle}
      />
      <Card
        icon={Cpu}
        label="Backbone Architecture"
        value="EfficientNetB0 + ResNet50"
        sub="3,328-D Feature Vector Fusion"
      />
    </div>
  );
}

