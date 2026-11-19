import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AudioVibeContext, type VibeMetrics } from "./useAudioVibe";

export type { VibeMetrics };

const CUSTOM_AUDIO_PATH = "/audio/vibe-track.mp3";

// Chill cyber-synthwave chord progression in C minor / Eb major (112 BPM)
const BASS_PATTERN = [65.41, 0, 65.41, 77.78, 58.27, 0, 58.27, 73.42, 51.91, 0, 51.91, 65.41, 49.0, 0, 58.27, 61.74];
const ARP_PATTERN = [
  261.63, 311.13, 392.0, 523.25, 311.13, 392.0, 466.16, 392.0,
  233.08, 293.66, 349.23, 466.16, 293.66, 349.23, 392.0, 349.23,
  207.65, 261.63, 311.13, 392.0, 261.63, 311.13, 392.0, 466.16,
  196.0, 246.94, 293.66, 392.0, 246.94, 293.66, 349.23, 293.66,
];

function resetCssVibeVars() {
  const root = document.documentElement;
  root.classList.remove("vibe-active");
  root.style.setProperty("--vibe-bass", "0");
  root.style.setProperty("--vibe-mid", "0");
  root.style.setProperty("--vibe-treble", "0");
  root.style.setProperty("--vibe-energy", "0");
  root.style.setProperty("--vibe-beat", "0");
}

export function AudioVibeProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.55);
  const [trackLabel, setTrackLabel] = useState("Cyber Synth Groove · 112 BPM");
  const [bands, setBands] = useState<number[]>(() => Array(8).fill(0.12));

  const vibeRef = useRef<VibeMetrics>({
    isPlaying: false,
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
    beat: 0,
    step: 0,
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const usingCustomTrackRef = useRef<boolean | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const stepIndexRef = useRef(0);
  const nextNoteTimeRef = useRef(0);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  const ensureAudioGraph = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = volume;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.72;

      master.connect(analyser);
      analyser.connect(ctx.destination);

      // Prebuild noise buffer for crisp hi-hat & snare transients
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      ctxRef.current = ctx;
      masterGainRef.current = master;
      analyserRef.current = analyser;
      noiseBufferRef.current = buffer;
    }
    return {
      ctx: ctxRef.current!,
      master: masterGainRef.current!,
      analyser: analyserRef.current!,
    };
  }, [volume]);

  const scheduleSynthStep = useCallback((step: number, time: number) => {
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const subStep = step % 16;

    // 1. Punchy kick on 0, 4, 8, 12 (plus syncopated 10)
    if (subStep % 4 === 0 || subStep === 10) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(145, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.14);
      gain.gain.setValueAtTime(0.85, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
      osc.connect(gain);
      gain.connect(master);
      osc.start(time);
      osc.stop(time + 0.24);
    }

    // 2. Crisp snare / clap on 4 & 12
    if ((subStep === 4 || subStep === 12) && noiseBufferRef.current) {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBufferRef.current;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1750, time);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.32, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      noise.start(time);
      noise.stop(time + 0.16);
    }

    // 3. Offbeat hi-hat on odd 16ths
    if (subStep % 2 === 1 && noiseBufferRef.current) {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBufferRef.current;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(6800, time);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(subStep % 4 === 2 ? 0.16 : 0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      noise.start(time);
      noise.stop(time + 0.06);
    }

    // 4. Warm saw/triangle sub-bass groove
    const bassFreq = BASS_PATTERN[step % BASS_PATTERN.length];
    if (bassFreq > 0) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(bassFreq, time);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(420, time);
      filter.frequency.exponentialRampToValueAtTime(140, time + 0.24);
      gain.gain.setValueAtTime(0.34, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.26);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start(time);
      osc.stop(time + 0.28);
    }

    // 5. Shimmering synthwave arpeggio pluck
    const arpFreq = ARP_PATTERN[step % ARP_PATTERN.length];
    const arpOsc = ctx.createOscillator();
    const arpFilter = ctx.createBiquadFilter();
    const arpGain = ctx.createGain();
    arpOsc.type = "triangle";
    arpOsc.frequency.setValueAtTime(arpFreq, time);
    arpFilter.type = "lowpass";
    arpFilter.frequency.setValueAtTime(2200, time);
    arpGain.gain.setValueAtTime(0.14, time);
    arpGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    arpOsc.connect(arpFilter);
    arpFilter.connect(arpGain);
    arpGain.connect(master);
    arpOsc.start(time);
    arpOsc.stop(time + 0.22);
  }, []);

  const stopPlayback = useCallback(() => {
    if (synthTimerRef.current !== null) {
      window.clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    vibeRef.current = {
      isPlaying: false,
      bass: 0,
      mid: 0,
      treble: 0,
      energy: 0,
      beat: 0,
      step: 0,
    };
    resetCssVibeVars();
    setBands(Array(8).fill(0.12));
    setIsPlaying(false);
  }, []);

  const startAnalyserLoop = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const root = document.documentElement;
    if (!reducedMotion) {
      root.classList.add("vibe-active");
    }

    let beatDecay = 0;
    let prevBass = 0;
    let uiTick = 0;

    const loop = () => {
      analyser.getByteFrequencyData(freqData);

      // Compute bass (bins 0-4), mid (5-18), treble (19-40)
      let bassSum = 0;
      for (let i = 0; i < 5; i++) bassSum += freqData[i];
      const bass = Math.min(1, bassSum / (5 * 225));

      let midSum = 0;
      for (let i = 5; i < 19; i++) midSum += freqData[i];
      const mid = Math.min(1, midSum / (14 * 190));

      let trebleSum = 0;
      for (let i = 19; i < 42; i++) trebleSum += freqData[i];
      const treble = Math.min(1, trebleSum / (23 * 165));

      const energy = Math.min(1, bass * 0.55 + mid * 0.3 + treble * 0.15);

      // Beat peak detection with smooth exponential decay
      if (bass - prevBass > 0.12 && bass > 0.36) {
        beatDecay = 1;
      } else {
        beatDecay *= 0.86;
      }
      prevBass = bass;

      vibeRef.current = {
        isPlaying: true,
        bass,
        mid,
        treble,
        energy,
        beat: beatDecay,
        step: stepIndexRef.current,
      };

      if (!reducedMotion) {
        root.style.setProperty("--vibe-bass", bass.toFixed(3));
        root.style.setProperty("--vibe-mid", mid.toFixed(3));
        root.style.setProperty("--vibe-treble", treble.toFixed(3));
        root.style.setProperty("--vibe-energy", energy.toFixed(3));
        root.style.setProperty("--vibe-beat", beatDecay.toFixed(3));
      }

      // Throttle React bar state to ~20fps for crisp visualizer without main-thread overhead
      uiTick++;
      if (uiTick % 3 === 0) {
        const nextBars: number[] = [];
        for (let b = 0; b < 8; b++) {
          const idx = Math.min(freqData.length - 1, b * 4 + 1);
          nextBars.push(Math.max(0.14, freqData[idx] / 255));
        }
        setBands(nextBars);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [reducedMotion]);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    setIsLoading(true);
    try {
      const { ctx, master } = ensureAudioGraph();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Check once if a custom MP3 exists at /audio/vibe-track.mp3
      if (usingCustomTrackRef.current === null) {
        try {
          const head = await fetch(CUSTOM_AUDIO_PATH, { method: "HEAD" });
          const ct = (head.headers.get("content-type") || "").toLowerCase();
          usingCustomTrackRef.current =
            head.ok && ct.includes("audio") && !ct.includes("text/html");
        } catch {
          usingCustomTrackRef.current = false;
        }
      }

      if (usingCustomTrackRef.current) {
        if (!audioElRef.current) {
          const el = new Audio(CUSTOM_AUDIO_PATH);
          el.loop = true;
          el.crossOrigin = "anonymous";
          const source = ctx.createMediaElementSource(el);
          source.connect(master);
          audioElRef.current = el;
        }
        await audioElRef.current.play();
        setTrackLabel("Custom Portfolio Track");
      } else {
        // Start lookahead 112 BPM synth scheduler (16th note = ~133.9ms)
        const stepDuration = 60 / 112 / 4;
        nextNoteTimeRef.current = ctx.currentTime + 0.04;
        setTrackLabel("Cyber Synth Groove · 112 BPM");

        synthTimerRef.current = window.setInterval(() => {
          if (!ctxRef.current) return;
          while (nextNoteTimeRef.current < ctxRef.current.currentTime + 0.14) {
            scheduleSynthStep(stepIndexRef.current, nextNoteTimeRef.current);
            nextNoteTimeRef.current += stepDuration;
            stepIndexRef.current += 1;
          }
        }, 35);
      }

      setIsPlaying(true);
      startAnalyserLoop();
    } finally {
      setIsLoading(false);
    }
  }, [
    ensureAudioGraph,
    isPlaying,
    scheduleSynthStep,
    startAnalyserLoop,
    stopPlayback,
  ]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        clamped,
        ctxRef.current.currentTime,
        0.04
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, [stopPlayback]);

  return (
    <AudioVibeContext.Provider
      value={{
        isPlaying,
        isLoading,
        volume,
        trackLabel,
        vibeRef,
        bands,
        togglePlay,
        setVolume,
      }}
    >
      {children}
    </AudioVibeContext.Provider>
  );
}
