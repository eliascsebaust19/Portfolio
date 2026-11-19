import { useEffect, useRef, useState, useCallback } from "react";
import { computeTimeline, FPS, TOTAL_FRAMES, SCENES } from "./timeline";
import { SmokeLayer } from "./SmokeLayer";
import { Particles } from "./Particles";
import { Logo3D } from "./Logo3D";
import { LightningStrike } from "./LightningStrike";
import { Typography } from "./Typography";
import { BeamCore, Vignette } from "./Lighting";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STAGE_W = 1920;
const STAGE_H = 1080;
const LOGO_CX = 960;
const LOGO_CY = 448;
const NAME_TOP = 698;
const EXIT_MS = 600;

interface LuxuryIntroProps {
  onReveal: () => void;
  onComplete: () => void;
  audioSrc?: string;
}

export function LuxuryIntro({
  onReveal,
  onComplete,
  audioSrc = "/audio/ea-intro.wav",
}: LuxuryIntroProps) {
  const reducedMotion = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [scale, setScale] = useState(1);
  const [contentScaleMultiplier, setContentScaleMultiplier] = useState(1);
  const [nameScale, setNameScale] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const exitTimerRef = useRef<number>(0);
  const audioFadeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isExitingRef = useRef(false);

  // Responsive full-bleed cover scaling (edge-to-edge fullscreen on all viewports)
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Cover scaling: ensures zero black bars, fills 100% of the screen
      const cover = Math.max(vw / STAGE_W, vh / STAGE_H);
      setScale(cover);
      setNameScale(Math.min(1, (vw * 0.88) / (690 * cover)));

      // Protect content on narrow portrait screens (mobile)
      if (vw < 768) {
        const safeRatio = Math.min(1, (vw * 0.88) / (440 * cover));
        setContentScaleMultiplier(safeRatio);
      } else {
        setContentScaleMultiplier(1);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale, { passive: true });
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const finishIntro = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    window.cancelAnimationFrame(rafRef.current);
    setIsExiting(true);
    onReveal();

    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audioFadeRef.current = window.setInterval(() => {
        audio.volume = Math.max(0, audio.volume - 0.1);
        if (audio.volume === 0) {
          audio.pause();
          window.clearInterval(audioFadeRef.current);
        }
      }, 35);
    }
    exitTimerRef.current = window.setTimeout(onComplete, EXIT_MS);
  }, [onComplete, onReveal]);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    isExitingRef.current = false;
    startTimeRef.current = performance.now();
    const audio = new Audio(audioSrc);
    audio.preload = "auto";
    audio.volume = 0.85;
    audioRef.current = audio;

    const elapsed = () => (performance.now() - startTimeRef.current) / 1000;
    const syncAudio = () => {
      // Autoplay or an early click may resolve after the soundtrack buffers.
      // Catch it up to the visible timeline instead of replaying missed strikes.
      const time = elapsed();
      if (Number.isFinite(audio.duration) && time < audio.duration && Math.abs(audio.currentTime - time) > 0.08) {
        audio.currentTime = time;
      }
    };
    const play = () => {
      if (!isExitingRef.current && audio.paused) {
        syncAudio();
        void audio.play().catch(() => {
          // A pointer or keyboard gesture can retry when autoplay is blocked.
        });
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishIntro();
      else play();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", play);
    audio.addEventListener("playing", syncAudio);
    play();

    const loop = (now: number) => {
      const currentFrame = Math.min(TOTAL_FRAMES, Math.max(0, now - startTimeRef.current) * FPS / 1000);
      setFrame(currentFrame);
      if (currentFrame >= TOTAL_FRAMES) finishIntro();
      else rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(exitTimerRef.current);
      window.clearInterval(audioFadeRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", play);
      audio.removeEventListener("playing", syncAudio);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [audioSrc, finishIntro, onComplete, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || isExiting) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isExiting, reducedMotion]);

  if (reducedMotion) return null;

  const tl = computeTimeline(frame);

  return (
    <div
      aria-hidden="true"
      data-cinematic-intro
      className={`fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-[#030303] select-none transition-opacity ease-out ${
        isExiting ? "pointer-events-none opacity-0" : "touch-none opacity-100"
      }`}
      style={{ transitionDuration: `${EXIT_MS}ms` }}
    >
      {/* 1920x1080 true full-bleed cover stage (edge-to-edge, zero black bars) */}
      <div
        style={{
          width: STAGE_W,
          height: STAGE_H,
          position: "absolute",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          filter: "contrast(1.06) saturate(0.9)",
          background: "radial-gradient(ellipse at 50% 30%, #0d131f 0%, #05070c 35%, #030303 66%)",
        }}
      >
        {tl.rest > 0 && (
          <SmokeLayer
            opacity={tl.rest}
            u={{
              t: tl.t,
              side: tl.side,
              gather: tl.gather,
              clear: tl.clear,
              dis: tl.dis,
              beam: tl.beam,
              amt: 1,
              seed: 0,
              ambient: tl.ambient,
              grain: 0.014,
            }}
          />
        )}

        {tl.particles > 0 && <Particles t={tl.t} fade={tl.particles} beam={tl.beam} />}

        {tl.beam > 0 && <BeamCore beam={tl.beam} />}

        {/* 3D Chrome Monogram & Exit scale */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${tl.exitScale * contentScaleMultiplier})`,
            transformOrigin: "center 48%",
          }}
        >
          {(tl.e.reveal > 0 || tl.a.reveal > 0) && (
            <Logo3D
              cx={LOGO_CX}
              cy={LOGO_CY}
              ry={tl.ry}
              rx={tl.rx}
              scale={tl.logoScale}
              e={tl.e.reveal}
              a={tl.a.reveal}
              eFlash={tl.e.reveal * tl.e.impact * 0.82}
              aFlash={tl.a.reveal * tl.a.impact * 0.82}
              sweepX={tl.sweepX}
              sweepGain={tl.sweepGain}
              bevelAz={tl.bevelAz}
              gradAngle={tl.gradAngle}
              gradShift={tl.gradShift}
            />
          )}

          {/* Front veil of smoke clearing around the logo */}
          {tl.frontSmoke > 0 && (
            <SmokeLayer
              u={{
                t: tl.t,
                side: 0.25,
                gather: 1,
                clear: 0,
                dis: 0,
                beam: 0,
                amt: tl.frontSmoke,
                seed: 7.3,
                ambient: 0,
                grain: 0,
              }}
            />
          )}

          {/* Name Reveal */}
          {frame >= SCENES.name.from && (
            <Typography
              scale={nameScale / contentScaleMultiplier}
              opacity={tl.nameOpacity}
              tracking={tl.tracking}
              y={tl.nameY}
              blur={tl.nameBlur}
              shine={tl.shine}
              accent={tl.accent}
              top={NAME_TOP}
            />
          )}
        </div>

        <LightningStrike letter="E" {...tl.e} contentScale={contentScaleMultiplier} />
        <LightningStrike letter="A" {...tl.a} contentScale={contentScaleMultiplier} />
        <Vignette />

        {/* Scene 6 transition veil into the portfolio */}
        {frame >= SCENES.transition.from && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#030303",
              opacity: tl.veil,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
