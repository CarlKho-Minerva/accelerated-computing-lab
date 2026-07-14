import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#07080a',
        panel: '#0d0f15',
        surface: '#141620',
        line: '#1c1f2b',
        muted: '#8b93a7',
        ink: '#f2f5f7',
        signal: '#76b900',
        cxl: '#38bdf8',
        amber: '#f5a524',
        critical: '#ff5252',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        signal: 'inset 0 0 0 1px rgba(118, 185, 0, 0.18)',
        cxl: 'inset 0 0 0 1px rgba(56, 189, 248, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config
