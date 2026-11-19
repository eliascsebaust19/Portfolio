import { useEffect, useRef } from "react";
import { useSeasonalTheme } from "@/context/useSeasonalTheme";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  vAngle: number;
  opacity: number;
  color: string;
  wobbleSpeed: number;
  wobbleRadius: number;
  wobblePhase: number;
  aspect: number;
}

export function SeasonalParticlesOverlay() {
  const { season } = useSeasonalTheme();
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
  });

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    let lastMouseX = -1000;
    let lastMouseY = -1000;
    let lastTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(0.016, (now - lastTime) / 1000);
      const vx = (e.clientX - lastMouseX) / dt;
      const vy = (e.clientY - lastMouseY) / dt;

      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        vx: Math.max(-400, Math.min(400, vx)),
        vy: Math.max(-400, Math.min(400, vy)),
      };

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastTime = now;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Number of particles depends on screen size (kept performant)
    const count = width < 768 ? 28 : 55;
    const particles: Particle[] = [];

    const getSeasonColors = () => {
      switch (season) {
        case "winter":
          return [
            "rgba(255, 255, 255, 0.85)",
            "rgba(224, 242, 254, 0.75)",
            "rgba(186, 230, 253, 0.65)",
            "rgba(56, 189, 248, 0.55)",
          ];
        case "spring":
          return [
            "rgba(244, 114, 182, 0.85)",
            "rgba(251, 207, 232, 0.75)",
            "rgba(249, 168, 212, 0.7)",
            "rgba(110, 231, 183, 0.55)",
          ];
        case "autumn":
          return [
            "rgba(251, 146, 60, 0.85)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(234, 88, 12, 0.75)",
            "rgba(217, 119, 6, 0.65)",
          ];
        case "cyber":
          return [
            "rgba(0, 229, 255, 0.85)",
            "rgba(34, 211, 238, 0.7)",
            "rgba(167, 139, 250, 0.75)",
            "rgba(124, 58, 237, 0.6)",
          ];
      }
    };

    const colors = getSeasonColors();

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.6 + Math.random() * 1.4,
        size: season === "winter" ? 2 + Math.random() * 3.5 : 3.5 + Math.random() * 5.5,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.035,
        opacity: 0.35 + Math.random() * 0.55,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobbleSpeed: 1 + Math.random() * 2,
        wobbleRadius: 0.8 + Math.random() * 1.8,
        wobblePhase: Math.random() * Math.PI * 2,
        aspect: 0.35 + Math.random() * 0.65,
      });
    }

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.016;

      const m = mouseRef.current;
      // Decay mouse velocity
      m.vx *= 0.94;
      m.vy *= 0.94;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Natural sway
        const sway = Math.sin(t * p.wobbleSpeed + p.wobblePhase) * p.wobbleRadius;
        p.x += p.vx + sway;
        p.y += p.vy;
        p.angle += p.vAngle;

        // Mouse wind interaction
        const dx = p.x - m.x;
        const dy = p.y - m.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 18000 && distSq > 1) {
          const force = (18000 - distSq) / 18000;
          p.x += (dx / Math.sqrt(distSq)) * force * 3 + m.vx * 0.012;
          p.y += (dy / Math.sqrt(distSq)) * force * 2.5 + m.vy * 0.012;
        }

        // Screen wrap
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -20) {
          p.y = height + 20;
        }
        if (p.x > width + 20) p.x = -20;
        else if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;

        if (season === "winter") {
          // Snowflake or soft crystalline dot
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Subtle frosty sparkle
          if (p.size > 3.5) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-p.size * 1.4, 0);
            ctx.lineTo(p.size * 1.4, 0);
            ctx.moveTo(0, -p.size * 1.4);
            ctx.lineTo(0, p.size * 1.4);
            ctx.stroke();
          }
        } else if (season === "spring") {
          // Sakura petal (curved oval)
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * p.aspect, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (season === "autumn") {
          // Golden leaf diamond/lozenge shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.2);
          ctx.quadraticCurveTo(p.size * 0.9, 0, 0, p.size * 1.2);
          ctx.quadraticCurveTo(-p.size * 0.9, 0, 0, -p.size * 1.2);
          ctx.fill();
        } else {
          // Cyberpunk data particle (sharp neon diamond/cross)
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [season, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-70 transition-opacity duration-700"
    />
  );
}
