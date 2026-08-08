/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a6f6',
          500: '#0c87e4',
          600: '#026bc2',
          700: '#03559d',
          800: '#074880',
          900: '#0b3d6b',
          950: '#072646',
        },
        darkBg: '#090d16',
        darkCard: '#111827',
        darkBorder: '#1f293d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(12, 135, 228, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(12, 135, 228, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
