import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // HabitGarden custom colors
        'sage': {
          50: '#f8fbf8',
          100: '#e7f2e7',
          200: '#d0e5d0',
          300: '#b4d6b4',
          400: '#95c495',
          500: '#77b277',
          600: '#5f995f',
          700: '#4a7a4a',
          800: '#385f38',
          900: '#2a492a',
          950: '#182a18',
        },
        'mint': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#6bbf8d',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        'warm': {
          50: '#fafaf4',
          100: '#f9f9f4',
          200: '#f0f0e8',
          300: '#e2e2d4',
          400: '#d1d1c0',
          500: '#b8b8a5',
          600: '#9a9a88',
          700: '#7f7f6f',
          800: '#666659',
          900: '#525248',
          950: '#2f2f2a',
        },
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // HabitGarden custom gradients (for accents, not backgrounds)
      backgroundImage: {
        'gradient-progress': 'linear-gradient(90deg, #A3D9A5, #78C57A)',
        'gradient-header': 'linear-gradient(120deg, #6BBF8D, #5FBA88)',
        'gradient-glow': 'radial-gradient(circle, #A3D9A5, #78C57A)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;