import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ["var(--font-headline)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        surface: "#F8FAFC",
        muted: "#F1F5F9",
        editorial: {
          red: "#B91C1C",
          navy: "#0F172A",
          gold: "#92400E",
        },
      },
    },
  },
  plugins: [],
};
export default config;
