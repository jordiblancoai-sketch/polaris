import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f3fa",
          100: "#dde4f3",
          200: "#c3cfe9",
          300: "#98afd9",
          400: "#6887c5",
          500: "#4767b5",
          600: "#354e99",
          700: "#2c3e7d",
          800: "#1e2d5e",
          900: "#0f1e45",
          950: "#03071e",
        },
        gold: {
          400: "#f5c842",
          500: "#e8b414",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
