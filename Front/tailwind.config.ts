import type { Config } from "tailwindcss";
// import forms from "@tailwindcss/forms";
// import containerQueries from "@tailwindcss/container-queries";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00E676",
        "primary-light": "#E6F9F0",
        "background-light": "#FAFBFA",
        "background-dark": "#0A0D0B",
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
        display: ["Pretendard", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  // plugins: [forms, containerQueries],
} satisfies Config;
