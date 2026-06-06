import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand palette — deep obsidian + champagne gold
        obsidian: {
          50:  "#f4f3f1",
          100: "#e5e2db",
          200: "#cbc4b8",
          300: "#afa497",
          400: "#948477",
          500: "#7d6e63",
          600: "#655750",
          700: "#4e4440",
          800: "#2e2825",
          900: "#1a1614",
          950: "#0d0b0a",
        },
        champagne: {
          50:  "#fdfaf3",
          100: "#faf3e0",
          200: "#f4e5bc",
          300: "#ecd18e",
          400: "#e2b85a",
          500: "#d4a032",
          600: "#b8841f",
          700: "#916419",
          800: "#6e4c18",
          900: "#4e3614",
          950: "#2a1c08",
        },
        ivory: {
          50:  "#fefefe",
          100: "#fdfcf9",
          200: "#faf7f0",
          300: "#f5f0e4",
          400: "#ede6d4",
          500: "#e2d8c0",
          600: "#d1c4a3",
          700: "#b8a882",
          800: "#9a8a62",
          900: "#7a6d4e",
          950: "#3d3628",
        },
        // Semantic
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-jost)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "display-sm": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["5rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "display-xl": ["7rem", { lineHeight: "0.95", letterSpacing: "-0.05em" }],
        "display-2xl": ["10rem", { lineHeight: "0.9", letterSpacing: "-0.06em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "42": "10.5rem",
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-32px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(32px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "grain": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(3%, 2%)" },
          "30%": { transform: "translate(-1%, 4%)" },
          "40%": { transform: "translate(4%, -1%)" },
          "50%": { transform: "translate(-3%, 2%)" },
          "60%": { transform: "translate(2%, 3%)" },
          "70%": { transform: "translate(-4%, -2%)" },
          "80%": { transform: "translate(3%, -3%)" },
          "90%": { transform: "translate(-1%, 1%)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        grain: "grain 0.8s steps(1) infinite",
        marquee: "marquee 30s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "noise": "url('/images/noise.svg')",
        "gold-shimmer":
          "linear-gradient(105deg, transparent 40%, rgba(212,160,50,0.3) 50%, transparent 60%)",
      },
      boxShadow: {
        "luxury": "0 4px 24px -4px rgba(26,22,20,0.3), 0 1px 4px rgba(26,22,20,0.1)",
        "luxury-lg": "0 16px 64px -8px rgba(26,22,20,0.4), 0 4px 16px rgba(26,22,20,0.15)",
        "gold": "0 0 0 1px rgba(212,160,50,0.3), 0 4px 24px -4px rgba(212,160,50,0.2)",
        "gold-glow": "0 0 32px rgba(212,160,50,0.15), 0 0 64px rgba(212,160,50,0.05)",
        "inset-luxury": "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "luxury-in": "cubic-bezier(0.55, 0, 1, 0.45)",
        "luxury-out": "cubic-bezier(0, 0.55, 0.45, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
