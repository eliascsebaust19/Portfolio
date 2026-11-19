import { useEffect, useRef, useState } from "react";
import { Sparkles, Check, ChevronDown } from "lucide-react";
import { useSeasonalTheme, type SeasonId } from "@/context/useSeasonalTheme";

export function SeasonalThemeSelector({ compact = false }: { compact?: boolean }) {
  const { season, seasonConfig, setSeason, isAuto, setIsAuto, availableSeasons } =
    useSeasonalTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (id: SeasonId) => {
    setSeason(id);
    setIsOpen(false);
  };

  const handleToggleAuto = () => {
    setIsAuto(!isAuto);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Seasonal Theme: ${seasonConfig.label}. Click to switch theme.`}
        className={`group relative flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-700/80 bg-obsidian/90 px-2.5 py-1 text-xs font-medium text-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:border-slate-600 hover:bg-surface hover:text-slate-100 ${
          compact ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
        }`}
        style={{
          boxShadow: isOpen
            ? `0 0 16px ${seasonConfig.glowColor}`
            : undefined,
        }}
      >
        <span className="text-sm select-none" aria-hidden="true">
          {seasonConfig.icon}
        </span>
        <span className="font-mono text-slate-200">
          {compact ? seasonConfig.label.split(" ")[0] : seasonConfig.label}
        </span>
        {isAuto && (
          <span className="hidden font-mono text-[9px] uppercase tracking-wider text-cyan sm:inline-block">
            Auto
          </span>
        )}
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-cyan" : "group-hover:text-slate-200"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="region"
          aria-label="Seasonal Theme Selector"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-2xl border border-slate-700/90 bg-obsidian/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(0,229,255,0.08)] backdrop-blur-xl animate-in fade-in-0 zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 px-2.5 py-2">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles size={12} className="text-cyan" />
              <span>Seasonal Themes</span>
            </div>
            <button
              type="button"
              onClick={handleToggleAuto}
              className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                isAuto
                  ? "bg-cyan/20 text-cyan border border-cyan/40"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Automatically match current calendar month"
            >
              Auto: {isAuto ? "ON" : "OFF"}
            </button>
          </div>

          {/* Theme list */}
          <div className="mt-1 space-y-1">
            {availableSeasons.map((s) => {
              const isSelected = s.id === season;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelect(s.id)}
                  className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-surface-elevated/90 border border-slate-700"
                      : "hover:bg-surface/70"
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? `inset 0 0 12px ${s.glowColor}`
                      : undefined,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-void/80 text-base shadow-sm">
                      {s.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 font-display text-xs font-semibold text-slate-200 group-hover:text-cyan">
                        <span>{s.label}</span>
                        <span className="font-mono text-[10px] text-slate-500 font-normal">
                          ({s.nativeName})
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-400">
                        {s.tagline}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      size={14}
                      className="text-cyan"
                      style={{ color: s.accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-2 border-t border-slate-800/80 px-2 pt-2 text-center font-mono text-[9px] text-slate-500">
            {seasonConfig.description}
          </div>
        </div>
      )}
    </div>
  );
}
