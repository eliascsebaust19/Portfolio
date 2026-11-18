/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050811",
        obsidian: "#080d1a",
        surface: "#0d1426",
        "surface-elevated": "#121b33",
        cyan: {
          DEFAULT: "#00e5ff",
          400: "#22d3ee",
          500: "#06b6d4",
        },
        teal: {
          DEFAULT: "#14b8a6",
          400: "#2dd4bf",
          500: "#14b8a6",
        },
        violet: {
          DEFAULT: "#7c3aed",
          400: "#a78bfa",
          500: "#8b5cf6",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
