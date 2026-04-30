import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        ember: "#e1251b",
        graphite: "#242424",
        steel: "#f3f4f6"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Arial Black", "Arial", "sans-serif"]
      },
      boxShadow: {
        hard: "8px 8px 0 #111111"
      }
    }
  },
  plugins: []
};

export default config;
