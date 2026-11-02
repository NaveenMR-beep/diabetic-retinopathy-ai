import { AlertOctagon, BookOpenCheck, ClipboardList, ListChecks, CheckCircle2 } from "lucide-react";

export default function DiseaseExplanation({ result }) {
  const isSevere = result.severity_style === "warning";

  return (
    <div
      className={`card-glass p-6 border ${
        isSevere ? "border-rose-500/40 bg-rose-950/20 shadow-glow-rose" : "border-slate-800"
      }`}
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
        {isSevere ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-glow-rose">
            <AlertOctagon size={20} />
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpenCheck size={20} />
          </div>
        )}
        <div>
          <span className="badge-label">{isSevere ? "Priority Clinical Alert" : "Diagnostic Explanation"}</span>
          <h3 className="text-lg font-bold font-display text-white mt-0.5">Understanding the Screening Result</h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-300 font-normal">{result.explanation}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-dark-850/60 p-4">
          <div className="flex items-center gap-2 text-white pb-3 border-b border-slate-800">
            <ListChecks size={16} className="text-cyan-400" />
            <p className="text-xs font-semibold uppercase tracking-wider">Possible Retinal Findings</p>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            {result.possible_findings.map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-dark-850/60 p-4">
          <div className="flex items-center gap-2 text-white pb-3 border-b border-slate-800">
            <ClipboardList size={16} className="text-emerald-400" />
            <p className="text-xs font-semibold uppercase tracking-wider">Recommended Next Steps</p>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            {result.next_step.map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-400 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

