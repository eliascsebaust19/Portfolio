import { useEffect, useMemo, useRef } from "react";
import { useAudioVibe } from "@/context/useAudioVibe";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParticleSeed {
  id: number;
  label: string;
  xPct: number;
  yPct: number;
  scatterX: number;
  scatterY: number;
  jumpPower: number;
  spin: number;
  phase: number;
  color: string;
  sizeClass: string;
}

const TOKENS = ["{ }", "</>", "01", "λ", "◈", "⚡", "API", "SQL", "=>", "✦", "[]", "◆"];
const COLORS = ["#00e5ff", "#2dd4bf", "#a78bfa", "#38bdf8"];

export function VibeParticles() {
  const { isPlaying, vibeRef } = useAudioVibe();
  const reducedMotion = useReducedMotion();
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const seeds = useMemo<ParticleSeed[]>(() => {
    return Array.from({ length: 18 }, (_, i) => {
      // Distribute mainly around left/right margins and upper/lower bands so text stays clean
      const side = i % 2 === 0 ? 1 : -1;
      const xPct = side > 0 ? 78 + ((i * 7) % 18) : 4 + ((i * 9) % 18);
      const yPct = 10 + ((i * 17) % 78);

      return {
        id: i,
        label: TOKENS[i % TOKENS.length],
        xPct,
        yPct,
        scatterX: side * (16 + (i % 5) * 11),
        scatterY: ((i % 3) - 1) * (18 + (i % 4) * 9),
        jumpPower: 18 + (i % 6) * 10,
        spin: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 6),
        phase: i * 0.72,
        color: COLORS[i % COLORS.length],
        sizeClass: i % 3 === 0 ? "text-sm sm:text-base" : "text-xs sm:text-sm",
      };
    });
  }, []);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const { bass, mid, beat, energy } = vibeRef.current;

      for (let i = 0; i < seeds.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const s = seeds[i];

        // Scatter outward on energy + jump vertically on bass/beat
        const bounceWave = Math.abs(Math.sin(t * 4.2 + s.phase));
        const jumpY =
          -(bass * s.jumpPower + beat * 18 * bounceWave) +
          Math.sin(t * 2.1 + s.phase) * 8;
        const sx =
          s.scatterX * (0.35 + energy * 0.95) +
          Math.cos(t * 1.8 + s.phase) * 10;
        const sy = s.scatterY * (0.25 + mid * 0.85) + jumpY;
        const rot = s.spin * (bass * 0.8 + beat * 0.6) + Math.sin(t + s.phase) * 10;
        const scale = 0.88 + beat * 0.36 + bass * 0.22;

        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(
          1
        )}px, 0) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = (0.35 + energy * 0.55).toFixed(2);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, reducedMotion, seeds, vibeRef]);

  if (!isPlaying || reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {seeds.map((s, idx) => (
        <span
          key={s.id}
          ref={(el) => {
            itemRefs.current[idx] = el;
          }}
          className={`absolute select-none rounded-lg border border-slate-700/60 bg-obsidian/70 px-2 py-1 font-mono font-semibold backdrop-blur-sm will-change-transform ${s.sizeClass}`}
          style={{
            left: `${s.xPct}%`,
            top: `${s.yPct}%`,
            color: s.color,
            boxShadow: `0 0 18px ${s.color}33`,
          }}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}
