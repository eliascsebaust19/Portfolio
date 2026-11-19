import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, FastForward } from "lucide-react";
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
  const [isMuted, setIsMuted] = useState(false);
  const [needsAudioInteraction, setNeedsAudioInteraction] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [scale, setScale] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isExitingRef = useRef(false);

  // Resize listener to fit 1920x1080 viewport seamlessly
  useEffect(() => {
    const updateScale = () => {
      const s = Math.min(
        window.innerWidth / STAGE_W,
        window.innerHeight / STAGE_H
      );
      setScale(Math.max(0.25, s));
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
          setTimeout(fadeStep, 40);
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

  // Audio initialization with autoplay policy handling
  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const audio = new Audio(audioSrc);
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 0.85;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked by browser policy until user interacts
        setNeedsAudioInteraction(true);
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [audioSrc, onComplete, reducedMotion]);

  // Enable audio on any click/touch if browser blocked autoplay
  const handleUserInteract = () => {
    if (needsAudioInteraction && audioRef.current) {
      audioRef.current.play().then(() => {
        setNeedsAudioInteraction(false);
      }).catch(() => {});
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
      setNeedsAudioInteraction(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleSkip = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      finishIntro();
    },
    [finishIntro]
  );

  // Keyboard shortcut: Escape or Space to skip
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Space") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSkip]);

  // Animation timeline loop
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
  const progressPct = Math.min(100, (frame / TOTAL_FRAMES) * 100);

  return (
    <div
      role="dialog"
      aria-label="Cinematic Intro — Elias Ahmad"
      onClick={handleUserInteract}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#030303] select-none transition-opacity duration-700 ease-out ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* 1920x1080 scaled luxury stage */}
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
        {/* Continuous WebGL volumetric smoke & dust */}
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
            transform: `scale(${tl.exitScale})`,
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

        {/* Scene 6 transition veil */}
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

      {/* Floating HUD Controls */}
      <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-6">
        {/* Sound Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute intro sound" : "Mute intro sound"}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-700/60 bg-black/60 px-3.5 py-1.5 font-mono text-xs text-slate-300 shadow-lg backdrop-blur-md transition-all hover:border-cyan/50 hover:bg-black/80 hover:text-cyan"
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{isMuted ? "Sound Off" : "Sound On"}</span>
        </button>

        {/* Center prompt if browser blocked autoplay */}
        {needsAudioInteraction && (
          <div className="hidden animate-pulse rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 font-mono text-xs text-cyan backdrop-blur-md sm:flex items-center gap-2">
            <Volume2 size={13} />
            <span>Click anywhere to enable sound</span>
          </div>
        )}

        {/* Skip button with animated border/progress */}
        <button
          type="button"
          onClick={handleSkip}
          aria-label="Skip cinematic intro"
          className="group flex cursor-pointer items-center gap-2 rounded-full border border-slate-700/60 bg-black/60 px-4 py-1.5 font-mono text-xs text-slate-300 shadow-lg backdrop-blur-md transition-all hover:border-cyan/60 hover:bg-black/80 hover:text-cyan"
        >
          <span>Skip Intro</span>
          <FastForward size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </header>

      {/* Mobile tap prompt if autoplay was blocked */}
      {needsAudioInteraction && (
        <div className="pointer-events-none absolute bottom-8 z-30 sm:hidden">
          <div className="animate-pulse rounded-full border border-cyan/40 bg-black/80 px-4 py-1.5 font-mono text-[11px] text-cyan backdrop-blur-md">
            Tap screen for sound 🔊
          </div>
        </div>
      )}

      {/* Subtle bottom timeline progress indicator */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-cyan via-teal to-violet transition-[width] duration-100 ease-linear"
          style={{ width: `${progressPct}%` }}
        />
      </footer>
    </div>
  );
}
