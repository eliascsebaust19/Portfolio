# EA — ELIAS AHMAD · Luxury Smoke Reveal

Cinematic 12-second logo reveal for a personal developer portfolio. Built with Remotion (React).

- Composition ID: `EALuxuryIntro`
- 1920 × 1080 · 30 fps · 360 frames (12 s)
- Fully deterministic (no `Math.random()`), no network requests at runtime. Font and audio are bundled.

## Run it

```bash
npm install
npm run dev      # open Remotion Studio and preview EALuxuryIntro
```

## Render the MP4

```bash
npm run build    # -> out/ea-luxury-intro.mp4
```

This is the same as:

```bash
npx remotion render src/index.ts EALuxuryIntro out/ea-luxury-intro.mp4 --gl=angle
```

The smoke is a WebGL shader, so keep `--gl=angle` (already set in `remotion.config.ts` for Studio and CLI renders).
Rendering is CPU-heavy because of the shader; pass `--concurrency=2` on small machines.

## Timeline

| Scene | Time | What happens |
|---|---|---|
| 1 Darkness | 0–2 s | Black screen, faint ambient light, dark smoke drifts in from both sides, dust appears |
| 2 Smoke formation | 2–4 s | Smoke gathers at the centre, a faint blurred EA silhouette forms behind it, a narrow silver beam appears |
| 3 EA reveal | 4–7 s | The chrome monogram rotates (spring) into a front-facing position, smoke clears around it, a light sweep crosses it |
| 4 Name | 7–9 s | ELIAS AHMAD tracks in, small crimson accent line draws underneath |
| 5 Hold | 9–11 s | Clean hold, smoke dissipates, reflections keep moving subtly |
| 6 Transition | 11–12 s | Slow scale-up and fade into black, ready to cut to the homepage |

## Project layout

```
src/
  EALuxuryIntro.tsx     composition: Sequences per scene, <Audio>
  timeline.ts           all animation values (interpolate + spring) in one place
  config.ts             size, fps, colours, optional smoke overlay path
  logoPaths.ts          the EA monogram geometry (single source of truth)
  shaders/smoke.ts      volumetric smoke + beam GLSL
  components/
    SmokeLayer.tsx      WebGL smoke
    SmokeOverlay.tsx    optional replaceable transparent smoke footage
    Particles.tsx       dust + soft bokeh (seeded PRNG)
    Logo3D.tsx          chrome monogram: CSS-3D extrusion, bevel lighting, reflections, sweep, crimson rim
    Typography.tsx      metallic ELIAS AHMAD + red accent
    Lighting.tsx        beam core + vignette
    FontLoader.tsx      loads bundled Montserrat locally
public/
  ea-logo.svg           chrome logo asset (ea-logo-mono.svg for a flat version)
  audio/ea-intro.wav    sound design
  fonts/Montserrat.ttf  OFL-licensed font
  smoke/                drop transparent smoke footage here (optional)
scripts/make_audio.py   regenerates the soundtrack (numpy + scipy)
```

## Sound design

`public/audio/ea-intro.wav` is synthesized by `scripts/make_audio.py` (`npm run audio`), so it is original and royalty-free:

| Time | Cue |
|---|---|
| 0–12 s | Deep drone, swelling into the reveal |
| 2.0–3.8 s | Atmospheric whoosh (smoke formation) |
| 4.25 s | Metallic impact (EA appears) |
| 5.7–7.3 s | Airy shimmer following the light sweep |
| 7.0–8.65 s | Riser under the name reveal, soft sub hit at the end |
| 10.5–12 s | Smooth fade-out |

If you change scene timing in `timeline.ts`, adjust the cue times at the top of `make_audio.py` and regenerate.

## Customising

- **Colours / accent:** `src/config.ts` and the gradient stops in `components/Logo3D.tsx`.
- **Monogram shape:** edit `src/logoPaths.ts` (the extrusion, bevel and sweep all follow it). Update `public/ea-logo.svg` to match.
- **Real smoke footage:** see `public/smoke/README.txt`.
- **Timing:** `src/timeline.ts`.

## Notes

- The reference MP4 was rendered with a harness that runs these same components with 60 fps sampling blended to 30 fps for motion blur. A normal Remotion render uses one sample per frame, so motion will be very slightly crisper.
- Remotion itself was not installed where this was authored, so `npm install` + Studio is the first thing to run on your machine.
