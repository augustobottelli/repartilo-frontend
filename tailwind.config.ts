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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF6B35",
          foreground: "#ffffff",
          50: "#FFF5F2",
          100: "#FFE5DD",
          200: "#FFCBBB",
          300: "#FFB199",
          400: "#FF8B67",
          500: "#FF6B35",
          600: "#F7931E",
          700: "#CC5A1F",
          800: "#994315",
          900: "#662D0E",
        },
        secondary: {
          DEFAULT: "#f4f4f5",
          foreground: "#18181b",
        },
        muted: {
          DEFAULT: "#f4f4f5",
          foreground: "#71717a",
        },
        accent: {
          DEFAULT: "#f4f4f5",
          foreground: "#18181b",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "#EF4444",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#18181b",
        },
        border: "#E5E7EB",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
