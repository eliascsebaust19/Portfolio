import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function useDeviceCapabilities() {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState({
    isMobile: false,
    isLowPower: false,
    supportsWebGL: true,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const isMobile = window.innerWidth < 768;
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as unknown as { deviceMemory?: number })
        .deviceMemory;
      const isLowPower = cores <= 2 || (typeof memory === "number" && memory <= 2);

      let supportsWebGL = true;
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl");
        supportsWebGL = Boolean(gl);
      } catch {
        supportsWebGL = false;
      }

      setState({ isMobile, isLowPower, supportsWebGL });
    };

    checkCapabilities();
    window.addEventListener("resize", checkCapabilities);
    return () => window.removeEventListener("resize", checkCapabilities);
  }, []);

  return {
    ...state,
    reducedMotion,
    canRender3D: state.supportsWebGL && !state.isLowPower,
  };
}
