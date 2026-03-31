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
        // Palette matched to official logo: vibrant red wordmark & sun yellow
        primary: {
          DEFAULT: "#E31837",
          light: "#FF4D6D",
          dark: "#A51229",
        },
        secondary: {
          DEFAULT: "#FFCD00",
          light: "#FFE14D",
          dark: "#E6B400",
        },
        accent: {
          DEFAULT: "#FFEB3B",
          light: "#FFF59D",
          dark: "#FBC02D",
        },
        logo: "#FFF9E6",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Helvetica", "Arial", "Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
