import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Eye, Cpu, Activity } from "lucide-react";
import { fetchHealth } from "../services/api";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/analysis", label: "Diagnostic AI" },
  { to: "/model-info", label: "Architecture" },
  { to: "/about", label: "System Info" },
];

export default function Header() {
  const [deviceInfo, setDeviceInfo] = useState("Loading...");

  useEffect(() => {
    fetchHealth()
      .then((res) => {
        if (res?.model_loaded) {
          setDeviceInfo(res.device ? `Device: ${res.device.toUpperCase()}` : "Ready");
        } else {
          setDeviceInfo("Model Offline");
        }
      })
      .catch(() => setDeviceInfo("API Offline"));
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark-950/80 border-b border-slate-800/80 shadow-glass">
      <div className="mx-auto max-w-7xl px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3.5 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-glow transition-all duration-300">
            <Eye size={22} className="group-hover:scale-110 transition-transform duration-300" strokeWidth={2.2} />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 border-2 border-dark-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                Retina<span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-block rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                v2.4 Hybrid
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Diabetic Retinopathy Screening • Deep Learning
            </p>
          </div>
        </NavLink>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-900/60 p-1.5 rounded-xl border border-slate-800/80">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Status chip */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-800 bg-dark-900/80 px-3.5 py-1.5 text-xs text-slate-300">
          <Activity size={13} className="text-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-slate-400">{deviceInfo}</span>
        </div>
      </div>
    </header>
  );
}

