/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#050805',
          panel: '#08110a',
          line: '#18311d',
          text: '#91f7a7',
          muted: '#5ea06b',
          strong: '#c8ffd3',
          danger: '#f87171',
        },
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        screen: '0 0 0 1px rgba(24, 49, 29, 0.8)',
      },
      keyframes: {
        blink: {
          '0%, 48%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1.2s steps(1, end) infinite',
      },
    },
  },
  plugins: [],
};
