import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type SeasonId,
  SEASONS,
} from "./seasonalThemeTypes";
import { SeasonalThemeContext } from "./useSeasonalTheme";

function getAutoDetectedSeason(): SeasonId {
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  // Dec, Jan, Feb -> Winter
  if (month === 11 || month === 0 || month === 1) return "winter";
  // Mar, Apr, May -> Spring
  if (month >= 2 && month <= 4) return "spring";
  // Sep, Oct, Nov -> Autumn
  if (month >= 8 && month <= 10) return "autumn";
  // Jun, Jul, Aug -> Cyber
  return "cyber";
}

const STORAGE_KEY = "portfolio_seasonal_theme";
const STORAGE_AUTO_KEY = "portfolio_seasonal_theme_auto";

export function SeasonalThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [season, setSeasonState] = useState<SeasonId>(() => {
    if (typeof window === "undefined") return "winter";
    const savedAuto = localStorage.getItem(STORAGE_AUTO_KEY);
    if (savedAuto === "true") return getAutoDetectedSeason();

    const saved = localStorage.getItem(STORAGE_KEY) as SeasonId | null;
    if (saved && SEASONS[saved]) return saved;

    return getAutoDetectedSeason();
  });

  const [isAuto, setIsAutoState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const savedAuto = localStorage.getItem(STORAGE_AUTO_KEY);
    return savedAuto !== "false";
  });

  const setSeason = useCallback((newSeason: SeasonId) => {
    setSeasonState(newSeason);
    setIsAutoState(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newSeason);
      localStorage.setItem(STORAGE_AUTO_KEY, "false");
    }
  }, []);

  const setIsAuto = useCallback((auto: boolean) => {
    setIsAutoState(auto);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_AUTO_KEY, String(auto));
      if (auto) {
        const detected = getAutoDetectedSeason();
        setSeasonState(detected);
        localStorage.setItem(STORAGE_KEY, detected);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-season", season);
      const conf = SEASONS[season];
      document.documentElement.style.setProperty(
        "--accent-seasonal",
        conf.accentColor
      );
      document.documentElement.style.setProperty(
        "--glow-seasonal",
        conf.glowColor
      );
    }
  }, [season]);

  const value = useMemo(
    () => ({
      season,
      seasonConfig: SEASONS[season],
      setSeason,
      isAuto,
      setIsAuto,
      availableSeasons: Object.values(SEASONS),
    }),
    [season, setSeason, isAuto, setIsAuto]
  );

  return (
    <SeasonalThemeContext.Provider value={value}>
      {children}
    </SeasonalThemeContext.Provider>
  );
}
