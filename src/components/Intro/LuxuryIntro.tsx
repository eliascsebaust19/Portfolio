import { useEffect, useRef, useState, useCallback } from "react";
import { computeTimeline, FPS, TOTAL_FRAMES, SCENES } from "./timeline";
import { SmokeLayer } from "./SmokeLayer";
import { Particles } from "./Particles";
import { Logo3D } from "./Logo3D";
import { Typography } from "./Typography";
import { BeamCore, Vignette } from "./Lighting";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STAGE_W = 1920;
const STAGE_H = 1080;
const LOGO_CX = 960;
const LOGO_CY = 448;
const NAME_TOP = 698;

interface LuxuryIntroProps {
  onComplete: () => void;
  audioSrc?: string;
}

export function LuxuryIntro({
  onComplete,
  audioSrc = "/audio/ea-intro.wav",
}: LuxuryIntroProps) {
  const reducedMotion = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [scale, setScale] = useState(1);
  const [contentScaleMultiplier, setContentScaleMultiplier] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
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
    setIsExiting(true);

    if (audioRef.current) {
      // Smooth audio fadeout
      const a = audioRef.current;
      let vol = a.volume;
      const fadeStep = () => {
        vol = Math.max(0, vol - 0.1);
        a.volume = vol;
        if (vol > 0.05) {
          setTimeout(fadeStep, 35);
        } else {
          a.pause();
        }
      };
      fadeStep();
    }

    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  // Audio setup: Always unmuted, full volume, autoplays immediately
  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const audio = new Audio(audioSrc);
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 0.9;
    audio.muted = false;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If browser blocks autoplay until interaction, start audio on first touch/click anywhere
        const enableOnGesture = () => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
          window.removeEventListener("pointerdown", enableOnGesture);
          window.removeEventListener("keydown", enableOnGesture);
          window.removeEventListener("touchstart", enableOnGesture);
        };
        window.addEventListener("pointerdown", enableOnGesture, { once: true });
        window.addEventListener("keydown", enableOnGesture, { once: true });
        window.addEventListener("touchstart", enableOnGesture, { once: true });
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [audioSrc, onComplete, reducedMotion]);

  // Keyboard shortcut: Escape to skip if needed
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finishIntro();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finishIntro]);

  // Animation timeline loop (0 to 360 frames = 12s)
  useEffect(() => {
    if (reducedMotion) return;

    startTimeRef.current = performance.now();

    const loop = (now: number) => {
      const elapsedSec = (now - startTimeRef.current) / 1000;
      const currentFrame = Math.min(TOTAL_FRAMES, elapsedSec * FPS);
      setFrame(currentFrame);

      if (currentFrame >= TOTAL_FRAMES) {
        finishIntro();
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [finishIntro, reducedMotion]);

  if (reducedMotion) return null;

  const tl = computeTimeline(frame);

  return (
    <div
      role="dialog"
      aria-label="Cinematic Intro — Elias Ahmad"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#030303] select-none transition-opacity duration-700 ease-out ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
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
          backgroundColor: "#030303",
        }}
      >
        {/* Continuous WebGL volumetric smoke & floating particles */}
        <SmokeLayer
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

        <Particles t={tl.t} fade={tl.particles} beam={tl.beam} />

        {/* Silver beam from behind (Scene 2 onward) */}
        {frame >= SCENES.formation.from && <BeamCore beam={tl.beam} />}

        {/* 3D Chrome Monogram & Exit scale */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${tl.exitScale * contentScaleMultiplier})`,
            transformOrigin: "center 48%",
          }}
        >
          {frame >= SCENES.formation.from && (
            <Logo3D
              cx={LOGO_CX}
              cy={LOGO_CY}
              ry={tl.ry}
              rx={tl.rx}
              scale={tl.logoScale}
              blur={tl.logoBlur}
              opacity={tl.logoOpacity}
              sweepX={tl.sweepX}
              sweepGain={tl.sweepGain}
              bevelAz={tl.bevelAz}
              gradAngle={tl.gradAngle}
              gradShift={tl.gradShift}
            />
          )}

          {/* Front veil of smoke clearing around the logo */}
          {frame >= SCENES.formation.from && frame < SCENES.name.from && (
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
