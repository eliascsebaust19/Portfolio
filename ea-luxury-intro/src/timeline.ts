import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./config";

// Scene map (frames @ 30fps)
export const SCENES = {
  darkness: { from: 0, duration: 60 }, // 0-2s
  formation: { from: 60, duration: 60 }, // 2-4s
  reveal: { from: 120, duration: 90 }, // 4-7s
  name: { from: 210, duration: 60 }, // 7-9s
  hold: { from: 270, duration: 60 }, // 9-11s
  transition: { from: 330, duration: 30 }, // 11-12s
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cubicOut = Easing.out(Easing.cubic);
const cubicInOut = Easing.inOut(Easing.cubic);

export type Timeline = ReturnType<typeof computeTimeline>;

export function computeTimeline(frame: number) {
  const t = frame / FPS;
  const ramp = (a: number, b: number, easing: (x: number) => number = cubicInOut) =>
    interpolate(t, [a, b], [0, 1], { ...clamp, easing });

  // ---- atmosphere ----
  const side = ramp(0.3, 2.4, cubicOut);
  const gather = ramp(2, 4.2);
  const clear = ramp(4, 6.4);
  const dis = ramp(9, 11, Easing.inOut(Easing.sin));
  const ambient = interpolate(t, [0, 2, 4, 7, 10], [0, 0.5, 0.8, 1, 0.6], clamp);
  const beam = interpolate(t, [2.2, 3.4, 8, 11], [0, 1, 0.9, 0.3], clamp);
  const frontSmoke = interpolate(t, [2, 2.8, 4.2, 5.8], [0, 0.75, 0.7, 0], clamp);
  const particles = interpolate(t, [0.6, 2.6, 10, 11.6], [0, 1, 1, 0], clamp);

  // ---- logo ----
  const rot = spring({
    frame: frame - 4 * FPS,
    fps: FPS,
    config: { damping: 14, mass: 1.6, stiffness: 14 },
  });
  const idle = ramp(6.5, 7.5);
  const ry =
    -58 * (1 - rot) + 1.6 * (1 - rot) * Math.sin(t * 1.1) + idle * 1.4 * Math.sin(t * 0.7);
  const rx = -9 * (1 - rot) + idle * 0.9 * Math.sin(t * 0.55 + 1);
  const logoScale = 0.9 + 0.1 * rot;
  const logoOpacity = interpolate(t, [2.3, 4.0, 5.4], [0, 0.2, 1], clamp);
  const logoBlur = interpolate(t, [2.3, 4.0, 5.8], [18, 10, 0], clamp);

  const sweep1 = ramp(5.7, 7.3, Easing.inOut(Easing.quad));
  const sweep2 = ramp(9.3, 10.6, Easing.inOut(Easing.quad));
  const sweepX = -150 + (t < 8 ? sweep1 : sweep2) * 640;
  const sweepGain = t < 8 ? 1 : 0.5;
  const bevelAz = 225 + ry * 0.6 + 30 * Math.sin(t * 0.45);
  const gradAngle = 72 + ry * 0.35 + 6 * Math.sin(t * 0.4);
  const gradShift = ry * 1.2 + 10 * Math.sin(t * 0.5);

  // ---- name ----
  const nameOpacity = ramp(7, 8.6, cubicOut);
  const nameSpring = spring({
    frame: frame - 7 * FPS,
    fps: FPS,
    config: { damping: 40, mass: 1.4, stiffness: 22 },
  });
  const tracking = 1.0 - 0.48 * nameSpring; // em
  const nameY = (1 - nameSpring) * 14;
  const nameBlur = (1 - nameOpacity) * 6;
  const shine = interpolate(t, [7, 12], [85, 15], clamp);
  const accent = ramp(8.2, 9.4, cubicOut);

  // ---- exit ----
  const veil = interpolate(frame, [330, 360], [0, 1], { ...clamp, easing: cubicInOut });
  const exitScale = interpolate(frame, [330, 360], [1, 1.08], { ...clamp, easing: cubicInOut });

  return {
    t, side, gather, clear, dis, ambient, beam, frontSmoke, particles,
    rot, ry, rx, logoScale, logoOpacity, logoBlur, sweepX, sweepGain, bevelAz, gradAngle, gradShift,
    nameOpacity, tracking, nameY, nameBlur, shine, accent, veil, exitScale,
  };
}
