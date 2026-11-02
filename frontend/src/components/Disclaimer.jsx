import { ShieldAlert, AlertTriangle } from "lucide-react";
import { DISCLAIMER_TEXT, URGENT_SYMPTOMS_TEXT } from "../constants/diseaseInfo";

export default function Disclaimer({ compact = false }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-dark-900/80 p-4 text-xs backdrop-blur-md">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-cyan-400" />
        <p className="text-slate-300 leading-relaxed">{DISCLAIMER_TEXT}</p>
      </div>
      {!compact && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs backdrop-blur-md">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-amber-200 leading-relaxed font-medium">{URGENT_SYMPTOMS_TEXT}</p>
        </div>
      )}
    </div>
  );
}

