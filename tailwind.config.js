/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // TxFlow brand palette — terminal / system-monitor aesthetic
        base: '#06080A',
        surface: '#0B0F11',
        panel: '#0F1517',
        elevated: '#141B1E',
        line: '#1C2528',
        'line-soft': '#161D20',
        mint: {
          DEFAULT: '#00E5A0',
          dim: '#0BA67A',
          deep: '#063B2C',
          glow: '#3DF7BD',
        },
        cyan: {
          DEFAULT: '#36E0FF',
          dim: '#1B7E92',
        },
        up: '#00E5A0',
        down: '#FF5470',
        warn: '#FFC44D',
        ink: {
          DEFAULT: '#E9F2EF',
          soft: '#9DB0AB',
          mute: '#5E706C',
          faint: '#3A4744',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,229,160,0.18), 0 0 24px -6px rgba(0,229,160,0.28)',
        panel: '0 1px 0 0 rgba(255,255,255,0.02) inset, 0 8px 40px -16px rgba(0,0,0,0.7)',
      },
      keyframes: {
        'fade-slide': {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-slide': 'fade-slide 0.45s cubic-bezier(0.22,1,0.36,1)',
        'pulse-soft': 'pulseSoft 1.6s ease-in-out infinite',
        scan: 'scan 5s linear infinite',
      },
    },
  },
  plugins: [],
}
