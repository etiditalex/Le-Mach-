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
        // Color palette from logo
        primary: {
          DEFAULT: "#8B4513", // Saddle Brown
          light: "#A0522D",
          dark: "#654321",
        },
        secondary: {
          DEFAULT: "#D2691E", // Chocolate
          light: "#E6A366",
          dark: "#B8860B",
        },
        accent: {
          DEFAULT: "#FFD700", // Gold
          light: "#FFE44D",
          dark: "#DAA520",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

