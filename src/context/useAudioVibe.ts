import { createContext, useContext } from "react";

export interface VibeMetrics {
  isPlaying: boolean;
  bass: number; // 0..1
  mid: number; // 0..1
  treble: number; // 0..1
  energy: number; // 0..1
  beat: number; // 0..1 decaying beat transient
  step: number; // 16th-note step counter
}

export interface AudioVibeContextValue {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  trackLabel: string;
  vibeRef: React.MutableRefObject<VibeMetrics>;
  bands: number[]; // 8 frequency bars for UI visualizer
  togglePlay: () => Promise<void>;
  setVolume: (v: number) => void;
}

export const AudioVibeContext = createContext<AudioVibeContextValue | null>(
  null
);

export function useAudioVibe(): AudioVibeContextValue {
  const ctx = useContext(AudioVibeContext);
  if (!ctx) {
    throw new Error("useAudioVibe must be used inside AudioVibeProvider");
  }
  return ctx;
}
