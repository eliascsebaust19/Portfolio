import React, { useLayoutEffect, useMemo, useRef } from "react";
import { mulberry32 } from "../utils/prng";
import { HEIGHT, WIDTH } from "../config";

type P = { x0: number; y0: number; vx: number; vy: number; size: number; phase: number; tw: number; bokeh: boolean; a: number };

const COUNT = 130;

/** Fine floating dust and a few soft bokeh motes. Brighter where they cross the light beam. */
export const Particles: React.FC<{ t: number; fade: number; beam: number }> = ({ t, fade, beam }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const parts = useMemo<P[]>(() => {
    const rnd = mulberry32(90210);
    return Array.from({ length: COUNT }, (_, i) => {
      const bokeh = i % 11 === 0;
      return {
        x0: rnd(),
        y0: rnd(),
        vx: (rnd() - 0.5) * 0.006,
        vy: -(0.004 + rnd() * 0.012),
        size: bokeh ? 5 + rnd() * 7 : 0.6 + rnd() * 1.3,
        phase: rnd() * Math.PI * 2,
        tw: 0.6 + rnd() * 1.6,
        bokeh,
        a: bokeh ? 0.03 + rnd() * 0.04 : 0.2 + rnd() * 0.5,
      };
    });
  }, []);

  useLayoutEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (const p of parts) {
      const x = (((p.x0 + p.vx * t + 0.004 * Math.sin(t * 0.7 + p.phase)) % 1) + 1) % 1;
      const y = (((p.y0 + p.vy * t) % 1) + 1) % 1;
      const px = x * WIDTH;
      const py = y * HEIGHT;
      // beam is tilted ~12deg through the centre
      const dx = (x - 0.5) * (WIDTH / HEIGHT) - (0.5 - y) * Math.tan(0.2094);
      const lit = 1 + 2.4 * beam * Math.exp(-(dx * dx) / 0.004);
      const tw = 0.55 + 0.45 * Math.sin(t * p.tw + p.phase);
      const alpha = Math.min(1, p.a * tw * lit * fade);
      if (alpha <= 0.002) continue;
      const g = ctx.createRadialGradient(px, py, 0, px, py, p.size);
      g.addColorStop(0, `rgba(225,230,240,${alpha})`);
      g.addColorStop(1, "rgba(225,230,240,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return (
    <canvas
      ref={ref}
      width={WIDTH}
      height={HEIGHT}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};
