export type SeasonId = "winter" | "spring" | "autumn" | "cyber";

export interface SeasonConfig {
  id: SeasonId;
  label: string;
  nativeName: string;
  icon: string;
  description: string;
  accentColor: string;
  secondaryColor: string;
  glowColor: string;
  tagline: string;
}

export const SEASONS: Record<SeasonId, SeasonConfig> = {
  winter: {
    id: "winter",
    label: "Winter Frost",
    nativeName: "শীতকাল",
    icon: "❄️",
    description: "Crisp crystalline snow, ice-blue aurora and frosted glow",
    accentColor: "#38bdf8",
    secondaryColor: "#0284c7",
    glowColor: "rgba(56, 189, 248, 0.28)",
    tagline: "Cold Logic · Crisp Code",
  },
  spring: {
    id: "spring",
    label: "Sakura Spring",
    nativeName: "বসন্তকাল",
    icon: "🌸",
    description: "Floating cherry blossom petals, fresh emerald energy",
    accentColor: "#f472b6",
    secondaryColor: "#34d399",
    glowColor: "rgba(244, 114, 182, 0.28)",
    tagline: "Blooming Ideas · Fresh Energy",
  },
  autumn: {
    id: "autumn",
    label: "Golden Autumn",
    nativeName: "হেমন্তকাল",
    icon: "🍂",
    description: "Swaying amber leaves, warm golden firelight",
    accentColor: "#fb923c",
    secondaryColor: "#f59e0b",
    glowColor: "rgba(251, 146, 60, 0.28)",
    tagline: "Warm Amber · Mature Craft",
  },
  cyber: {
    id: "cyber",
    label: "Cyber Matrix",
    nativeName: "সাইবারপাঙ্ক",
    icon: "⚡",
    description: "High-tech electric cyan and ultra-violet data matrix",
    accentColor: "#00e5ff",
    secondaryColor: "#7c3aed",
    glowColor: "rgba(0, 229, 255, 0.28)",
    tagline: "Futuristic · Infinite Horizon",
  },
};
