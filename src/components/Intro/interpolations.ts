// Math and interpolation primitives for the Luxury Intro animation engine

type Fn = (t: number) => number;

const bezier = (x1: number, y1: number, x2: number, y2: number): Fn => (x) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = 3 * x1,
    bx = 3 * (x2 - x1) - cx,
    ax = 1 - cx - bx;
  const cy = 3 * y1,
    by = 3 * (y2 - y1) - cy,
    ay = 1 - cy - by;
  let lo = 0,
    hi = 1,
    t = x;
  for (let i = 0; i < 40; i++) {
    const xt = ((ax * t + bx) * t + cx) * t;
    if (Math.abs(xt - x) < 1e-6) break;
    if (xt < x) lo = t;
    else hi = t;
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
  out:
    (f: Fn): Fn =>
    (t) =>
      1 - f(1 - t),
  inOut:
    (f: Fn): Fn =>
    (t) =>
      t < 0.5 ? f(t * 2) / 2 : 1 - f((1 - t) * 2) / 2,
};

export function interpolate(
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  opts: {
    extrapolateLeft?: "extend" | "clamp" | "identity";
    extrapolateRight?: "extend" | "clamp" | "identity";
    easing?: Fn;
  } = {}
): number {
  const {
    extrapolateLeft = "extend",
    extrapolateRight = "extend",
    easing = (t: number) => t,
  } = opts;
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
  const a = inputRange[i - 1],
    b = inputRange[i];
  const u = easing((input - a) / (b - a));
  return outputRange[i - 1] + (outputRange[i] - outputRange[i - 1]) * u;
}

export function spring(o: {
  frame: number;
  fps: number;
  config?: {
    damping?: number;
    mass?: number;
    stiffness?: number;
    overshootClamping?: boolean;
  };
  from?: number;
  to?: number;
  delay?: number;
  reverse?: boolean;
}): number {
  const { frame, fps, from = 0, to = 1, delay = 0 } = o;
  const t = Math.max(0, (frame - delay) / fps);
  if (t === 0) return from;

  const m = o.config?.mass ?? 1;
  const k = o.config?.stiffness ?? 100;
  const c = o.config?.damping ?? 10;
  const w0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(k * m));

  let x = 0;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    x =
      1 -
      Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  } else if (zeta === 1) {
    x = 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  } else {
    const s = Math.sqrt(zeta * zeta - 1);
    const r1 = -w0 * (zeta - s);
    const r2 = -w0 * (zeta + s);
    x = 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
  }

  if (o.config?.overshootClamping && x > 1) x = 1;
  return from + (to - from) * x;
}
