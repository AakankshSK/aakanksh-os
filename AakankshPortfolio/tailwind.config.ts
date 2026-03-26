import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#111111",
        "surface-2": "#161616",
        border: "rgba(237, 237, 237, 0.10)",
        "border-strong": "rgba(237, 237, 237, 0.18)",
        muted: "#6B7280",
        foreground: "#EDEDED",
        accent: {
          DEFAULT: "#C9F31D",
          muted: "#9FBF17",
        },
        accent2: {
          DEFAULT: "#7DF9FF",
          muted: "#57C7CC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "system-vignette":
          "radial-gradient(120% 80% at 50% -20%, rgba(125,249,255,0.06), transparent 56%)",
      },
      boxShadow: {
        lift: "0 1px 0 rgba(255,255,255,0.05) inset, 0 26px 56px -20px rgba(0,0,0,0.72)",
        "lift-sm": "0 1px 0 rgba(255,255,255,0.05) inset, 0 14px 30px -14px rgba(0,0,0,0.6)",
        card: "0 22px 44px -18px rgba(0,0,0,0.75)",
      },
    },
  },
  plugins: [],
};

export default config;
