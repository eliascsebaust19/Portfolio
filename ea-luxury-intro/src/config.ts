export const FPS = 30;
export const DURATION = 360; // 12s
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLORS = {
  black: "#030303",
  silver: "#d7dbe1",
  chrome: "#9aa0a8",
  crimson: "#9b1020",
};

/**
 * Optional replaceable smoke footage.
 * Drop a transparent (alpha) smoke clip into /public/smoke/ and set the path,
 * e.g. "smoke/smoke-overlay.webm". It is layered on top of the procedural smoke
 * with a screen blend. Leave null to use the built-in procedural smoke only.
 */
export const SMOKE_OVERLAY: string | null = null;
