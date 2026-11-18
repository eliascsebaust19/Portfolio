import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(reducedMotion ? 100 : 12);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const start = performance.now();
    const duration = 750;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.round(12 + eased * 88));

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setExiting(true);
        setTimeout(onComplete, 380);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center bg-void transition-all duration-400 ${
        exiting ? "pointer-events-none opacity-0 scale-[1.02]" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-6 px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan/30 bg-surface shadow-[0_0_40px_rgba(0,229,255,0.14)]">
          <span className="font-display text-2xl font-bold tracking-tight text-slate-100">
            {profile.monogram}
          </span>
        </div>

        <div className="text-center">
          <p className="font-display text-sm font-semibold tracking-[0.3em] text-slate-200">
            {profile.name}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-400">
            CSE · BAUST · Initializing Experience
          </p>
        </div>

        <div className="w-56">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan via-teal to-violet transition-[width] duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[11px] text-slate-500">
            <span>LOADING</span>
            <span className="text-cyan">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
