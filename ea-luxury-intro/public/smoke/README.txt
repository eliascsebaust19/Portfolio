Optional replaceable smoke footage
==================================

The intro already ships with a procedural (shader) smoke, so this folder can stay empty.

To layer real smoke footage on top:
1. Export a transparent smoke clip (VP9 .webm with alpha, or ProRes 4444) at 1920x1080.
2. Save it here, e.g. public/smoke/smoke-overlay.webm
3. In src/config.ts set:  export const SMOKE_OVERLAY = "smoke/smoke-overlay.webm";

It is blended with "screen" on top of the procedural smoke (src/components/SmokeOverlay.tsx).
