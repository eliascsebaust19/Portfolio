import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hoverState, setHoverState] = useState<"default" | "pointer" | "hidden">(
    "hidden"
  );

  useEffect(() => {
    const check = () => {
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const desktop = window.innerWidth >= 1024;
      setEnabled(finePointer && desktop && !reducedMotion);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("has-custom-cursor");
      return;
    }

    document.body.classList.add("has-custom-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      const target = e.target as HTMLElement | null;
      if (!target) {
        setHoverState("default");
        return;
      }

      if (
        target.closest("input, textarea, select, [data-cursor='disable']")
      ) {
        setHoverState("hidden");
      } else if (
        target.closest("a, button, [role='button'], [data-cursor='pointer']")
      ) {
        setHoverState("pointer");
      } else {
        setHoverState("default");
      }
    };

    const onLeave = () => setHoverState("hidden");

    const render = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isHidden = hoverState === "hidden";
  const isPointer = hoverState === "pointer";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-cyan transition-opacity duration-150 ${
          isHidden ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 rounded-full border transition-[width,height,margin,border-color,background-color,opacity] duration-200 ${
          isHidden
            ? "-ml-4 -mt-4 h-8 w-8 border-cyan/0 opacity-0"
            : isPointer
              ? "-ml-6 -mt-6 h-12 w-12 border-cyan/70 bg-cyan/10 opacity-100"
              : "-ml-4 -mt-4 h-8 w-8 border-cyan/40 bg-transparent opacity-80"
        }`}
      />
    </div>
  );
}
