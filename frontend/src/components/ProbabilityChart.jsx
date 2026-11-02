import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { SHORT_LABELS } from "../constants/diseaseInfo";

const BAR_COLORS = [
  "#10b981", // Emerald - Normal
  "#06b6d4", // Cyan - Mild
  "#f59e0b", // Amber - Moderate
  "#f97316", // Orange - Severe
  "#f43f5e", // Rose/Red - Proliferative
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-700 bg-dark-950/95 p-3 text-xs shadow-glow backdrop-blur-md">
        <p className="font-semibold text-white">{item.fullName}</p>
        <p className="mt-1 font-mono text-cyan-400 font-bold text-sm">
          {item.value.toFixed(1)}% Confidence
        </p>
      </div>
    );
  }
  return null;
};

export default function ProbabilityChart({ probabilities }) {
  const data = SHORT_LABELS.map((label, idx) => {
    const fullName = Object.keys(probabilities)[idx];
    const value = probabilities[fullName] ?? 0;
    return {
      label,
      fullName,
      value: Math.round(value * 1000) / 10, // percentage, 1 decimal
    };
  });

  return (
    <div className="card-glass p-6 border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800 mb-6">
        <div>
          <span className="badge-label">Probability Distribution</span>
          <h3 className="mt-1 text-xl font-bold font-display text-white">
            Multiclass Softmax Distribution
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Sum = 100.0%</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 45, top: 0, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
            <YAxis type="category" dataKey="label" width={115} tick={{ fill: "#f1f5f9", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.03)" }} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={BAR_COLORS[idx]} className="transition-all duration-300 hover:opacity-80" />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(v) => `${v.toFixed(1)}%`}
                style={{ fill: "#38bdf8", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

