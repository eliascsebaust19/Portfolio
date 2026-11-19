// Minimal stand-in for the `remotion` package, used ONLY by the local render harness
// (where Remotion itself can't be installed). Real projects use the real package.
import React, { createContext, useContext } from "react";

export const FrameContext = createContext<number>(0);
const CONFIG = { fps: 30, width: 1920, height: 1080, durationInFrames: 360, id: "EALuxuryIntro" };

export const useCurrentFrame = () => useContext(FrameContext);
export const useVideoConfig = () => CONFIG;

export const AbsoluteFill: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ style, children }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", ...style }}>{children}</div>
);

export const Sequence: React.FC<
  React.PropsWithChildren<{ from?: number; durationInFrames?: number; name?: string; layout?: "none" | "absolute-fill" }>
> = ({ from = 0, durationInFrames = Infinity, layout, children }) => {
  const f = useContext(FrameContext);
  if (f < from || f >= from + durationInFrames) return null;
  const inner = <FrameContext.Provider value={f - from}>{children}</FrameContext.Provider>;
  return layout === "none" ? inner : <AbsoluteFill>{inner}</AbsoluteFill>;
};

export const Audio: React.FC<any> = () => null;
export const OffthreadVideo: React.FC<any> = () => null;
export const staticFile = (p: string) => `/public/${p}`;

let pending = 0;
export const delayRender = (_label?: string) => {
  pending++;
  return pending * 1000 + Math.random() * 0; // handle id is irrelevant here
};
export const continueRender = (_h: number) => {
  pending = Math.max(0, pending - 1);
};
(window as any).__pendingRenders = () => pending;

// ---------- Easing ----------
type Fn = (t: number) => number;
const bezier = (x1: number, y1: number, x2: number, y2: number): Fn => (x) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 40; i++) {
    const xt = ((ax * t + bx) * t + cx) * t;
    if (Math.abs(xt - x) < 1e-6) break;
    if (xt < x) lo = t; else hi = t;
    t = (lo + hi) / 2;
  }
  return ((ay * t + by) * t + cy) * t;
};
export const Easing = {
  linear: ((t: number) => t) as Fn,
  ease: bezier(0.42, 0, 1, 1),
  quad: ((t: number) => t * t) as Fn,
  cubic: ((t: number) => t * t * t) as Fn,
  sin: ((t: number) => 1 - Math.cos((t * Math.PI) / 2)) as Fn,
  bezier,
  in: (f: Fn): Fn => f,
  out: (f: Fn): Fn => (t) => 1 - f(1 - t),
  inOut: (f: Fn): Fn => (t) => (t < 0.5 ? f(t * 2) / 2 : 1 - f((1 - t) * 2) / 2),
};

// ---------- interpolate ----------
export function interpolate(
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  opts: { extrapolateLeft?: string; extrapolateRight?: string; easing?: Fn } = {},
): number {
  const { extrapolateLeft = "extend", extrapolateRight = "extend", easing = (t: number) => t } = opts;
  const n = inputRange.length;
  if (input < inputRange[0]) {
    if (extrapolateLeft === "clamp") return outputRange[0];
    if (extrapolateLeft === "identity") return input;
  }
  if (input > inputRange[n - 1]) {
    if (extrapolateRight === "clamp") return outputRange[n - 1];
    if (extrapolateRight === "identity") return input;
  }
  let i = 1;
  while (i < n - 1 && input > inputRange[i]) i++;
  const a = inputRange[i - 1], b = inputRange[i];
  const u = easing((input - a) / (b - a));
  return outputRange[i - 1] + (outputRange[i] - outputRange[i - 1]) * u;
}

// ---------- spring (damped harmonic oscillator, deterministic) ----------
export function spring(o: {
  frame: number;
  fps: number;
  config?: { damping?: number; mass?: number; stiffness?: number; overshootClamping?: boolean };
  from?: number;
  to?: number;
  delay?: number;
  reverse?: boolean;
}): number {
  const { frame, fps, from = 0, to = 1, delay = 0 } = o;
  const c = { damping: 10, mass: 1, stiffness: 100, overshootClamping: false, ...(o.config || {}) };
  const f = frame - delay;
  if (f <= 0) return from;
  const total = f / fps;
  const steps = Math.max(1, Math.round(total * 480));
  const dt = total / steps;
  let x = 0, v = 0;
  for (let i = 0; i < steps; i++) {
    const a = (-c.stiffness * (x - 1) - c.damping * v) / c.mass;
    v += a * dt;
    x += v * dt;
    if (c.overshootClamping && x > 1) { x = 1; v = 0; }
  }
  return from + (to - from) * x;
}
