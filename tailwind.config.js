/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#edfff4',
          100: '#d5ffe8',
          200: '#aeffd3',
          300: '#70ffb0',
          400: '#2bfd85',
          500: '#00e563',
          600: '#00be4e',
          700: '#009440',
          800: '#067436',
          900: '#075f2e',
          950: '#013619',
        },
        navy: {
          900: '#060b14',
          800: '#0a1020',
          700: '#0f172a',
          600: '#141e33',
          500: '#1a2540',
          400: '#1e2d4d',
          300: '#253460',
        },
        surface: {
          100: '#162032',
          200: '#1c2a3f',
          300: '#223350',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
