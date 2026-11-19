import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { Cpu, Sparkles } from "lucide-react";

interface AvatarLoadingScreenProps {
  modelStatus: "checking" | "ready" | "missing";
  modelTitle?: string;
}

export function AvatarLoadingScreen({
  modelStatus,
  modelTitle = "Executive Avatar",
}: AvatarLoadingScreenProps) {
  const { active, progress } = useProgress();
  const [show, setShow] = useState(true);

  // Consider it loading if Drei reports active/progress < 100, or model status is "checking"
  const isLoading = (active && progress < 100) || modelStatus === "checking";

  useEffect(() => {
    let timer: number;
    if (!isLoading) {
      // Gentle delayed fade out for visual smoothness
      timer = window.setTimeout(() => {
        setShow(false);
      }, 350);
    } else {
      setShow(true);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!show && !isLoading) return null;

  const displayProgress = Math.min(100, Math.max(0, Math.round(progress || 0)));

  const getPhaseText = () => {
    if (displayProgress < 25) return "STREAMING 3D GEOMETRY...";
    if (displayProgress < 60) return "PARSING SKELETAL RIG...";
    if (displayProgress < 90) return "SYNCHRONIZING TEXTURES...";
    if (displayProgress < 100) return "INITIALIZING SHADER PIPELINE...";
    return "PROJECTION ONLINE";
  };

  return (
    <div
      aria-live="polite"
      aria-label={`Loading 3D Avatar: ${displayProgress}%`}
      className={`pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
        isLoading
          ? "opacity-100 scale-100 backdrop-blur-[2px]"
          : "opacity-0 scale-95"
      }`}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-12 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.12),rgba(124,58,237,0.06)_50%,transparent_70%)] blur-2xl" />

      {/* Cyberpunk Holographic HUD Container */}
      <div className="relative flex flex-col items-center rounded-3xl border border-slate-700/60 bg-obsidian/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.12)] backdrop-blur-xl sm:min-w-[280px]">
        {/* Holographic Radar Ring Spinner */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Outer dashed spinning ring */}
          <div
            className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-cyan/40"
            style={{ animationDuration: "8s" }}
          />

          {/* Reverse spinning arc ring */}
          <div
            className="absolute inset-1.5 animate-spin rounded-full border-2 border-transparent border-t-violet border-r-cyan"
            style={{ animationDuration: "2.4s", animationDirection: "reverse" }}
          />

          {/* Innermost pulsing ring */}
          <div className="absolute inset-3.5 animate-pulse rounded-full border border-cyan/30 bg-void/60 shadow-[inset_0_0_12px_rgba(0,229,255,0.2)]" />

          {/* Core Icon */}
          <div className="relative z-10 flex items-center justify-center text-cyan">
            <Cpu size={22} className="animate-pulse drop-shadow-[0_0_8px_#00e5ff]" />
          </div>
        </div>

        {/* Status Headings */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan">
            <Sparkles size={11} className="text-cyan animate-pulse" />
            <span>Hologram Calibration</span>
          </div>
          <p className="mt-0.5 font-display text-sm font-semibold tracking-wide text-slate-100">
            {modelTitle}
          </p>
        </div>

        {/* Progress Bar Track */}
        <div className="mt-3.5 w-48 max-w-full">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan via-teal to-violet transition-all duration-300 ease-out shadow-[0_0_8px_#00e5ff]"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          {/* Metrics row */}
          <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
            <span className="text-slate-400">{getPhaseText()}</span>
            <span className="font-bold text-cyan">{displayProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
