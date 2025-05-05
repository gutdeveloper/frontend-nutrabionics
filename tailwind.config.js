/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3c2052",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#EFEFEF",
          foreground: "#222222",
        },
        background: "#FFFFFF",
        foreground: "#222222",
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F3F4F6",
          foreground: "#3c2052",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#3c2052",
      },
    },
  },
  plugins: [],
} 