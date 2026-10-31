import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
        50: "rgb(var(--z-50) / <alpha-value>)",
        100: "rgb(var(--z-100) / <alpha-value>)",
        200: "rgb(var(--z-200) / <alpha-value>)",
        300: "rgb(var(--z-300) / <alpha-value>)",
        400: "rgb(var(--z-400) / <alpha-value>)",
        500: "rgb(var(--z-500) / <alpha-value>)",
        600: "rgb(var(--z-600) / <alpha-value>)",
        700: "rgb(var(--z-700) / <alpha-value>)",
        800: "rgb(var(--z-800) / <alpha-value>)",
        850: "rgb(var(--z-850) / <alpha-value>)",
        900: "rgb(var(--z-900) / <alpha-value>)",
        950: "rgb(var(--z-950) / <alpha-value>)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "rgb(var(--p) / <alpha-value>)",
          foreground: "#000000",
          hover: "rgb(var(--p-hover) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "#1e1e24",
          foreground: "#f3f4f6",
        },
        muted: {
          DEFAULT: "#18181b",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        border: "#27272a",
        input: "#27272a",
        ring: "#00ff88",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
