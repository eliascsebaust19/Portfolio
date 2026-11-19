import { useState } from "react";
import { Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useAudioVibe } from "@/context/useAudioVibe";

export function AudioPlayerWidget() {
  const { isPlaying, isLoading, volume, trackLabel, bands, togglePlay, setVolume } =
    useAudioVibe();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
      role="region"
      aria-label="Portfolio Music & Vibe Mode Controller"
    >
      {/* Expanded Volume & Track Drawer */}
      {expanded && (
        <div className="w-60 rounded-2xl border border-slate-700/80 bg-obsidian/95 p-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.65)] backdrop-blur-lg">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[11px] text-cyan">
              {trackLabel}
            </span>
            <button
              type="button"
              onClick={() => setVolume(volume === 0 ? 0.55 : 0)}
              aria-label={volume === 0 ? "Unmute audio" : "Mute audio"}
              className="text-slate-400 transition-colors hover:text-cyan"
            >
              {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2.5">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              aria-label="Music volume"
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-cyan"
            />
            <span className="w-8 text-right font-mono text-[10px] text-slate-400">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <p className="mt-2 font-mono text-[10px] text-slate-500">
            Components, 3D avatar &amp; particles react live to the beat.
          </p>
        </div>
      )}

      {/* Main Compact Pill */}
      <div
        className={`flex items-center gap-2.5 rounded-full border px-2.5 py-2 backdrop-blur-md transition-all duration-300 ${
          isPlaying
            ? "border-cyan/60 bg-obsidian/90 shadow-[0_0_28px_rgba(0,229,255,0.22)]"
            : "border-slate-700/80 bg-obsidian/85 shadow-[0_12px_36px_rgba(0,0,0,0.55)] hover:border-cyan/40"
        }`}
      >
        <button
          type="button"
          onClick={() => void togglePlay()}
          disabled={isLoading}
          aria-label={isPlaying ? "Pause Vibe Mode music" : "Play Vibe Mode music"}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
            isPlaying
              ? "bg-gradient-to-tr from-cyan to-teal text-void shadow-[0_0_14px_rgba(0,229,255,0.45)]"
              : "bg-surface text-cyan hover:bg-cyan/15"
          }`}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>

        {/* Live Equalizer Bars + Label */}
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label="Toggle audio controls"
          className="flex items-center gap-2.5 pr-1.5 text-left"
        >
          <div className="flex h-6 items-end gap-[2.5px]" aria-hidden="true">
            {bands.map((val, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-full transition-[height] duration-75 ${
                  isPlaying
                    ? i % 2 === 0
                      ? "bg-cyan"
                      : "bg-teal-400"
                    : "bg-slate-600"
                }`}
                style={{
                  height: `${Math.round((isPlaying ? val : 0.22) * 22)}px`,
                }}
              />
            ))}
          </div>

          <div className="hidden flex-col sm:flex">
            <span className="font-mono text-[11px] font-semibold tracking-wide text-slate-100">
              {isPlaying ? "VIBE ON" : "VIBE MODE"}
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {isPlaying ? "Audio Reactive" : "Play Music"}
            </span>
          </div>

          <Music2
            size={14}
            className={`sm:hidden ${isPlaying ? "text-cyan" : "text-slate-400"}`}
          />
        </button>
      </div>
    </div>
  );
}
