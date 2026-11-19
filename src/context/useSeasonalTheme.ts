import { createContext, useContext } from "react";
import type { SeasonId, SeasonConfig } from "./seasonalThemeTypes";

export interface SeasonalThemeContextType {
  season: SeasonId;
  seasonConfig: SeasonConfig;
  setSeason: (season: SeasonId) => void;
  isAuto: boolean;
  setIsAuto: (auto: boolean) => void;
  availableSeasons: SeasonConfig[];
}

export const SeasonalThemeContext =
  createContext<SeasonalThemeContextType | null>(null);

export function useSeasonalTheme() {
  const ctx = useContext(SeasonalThemeContext);
  if (!ctx) {
    throw new Error(
      "useSeasonalTheme must be used within SeasonalThemeProvider"
    );
  }
  return ctx;
}

export type { SeasonId, SeasonConfig } from "./seasonalThemeTypes";
export { SEASONS } from "./seasonalThemeTypes";
