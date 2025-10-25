import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B81',
        accent: '#FF9671',
        highlight: '#FFD6A5',
        secondary: '#C5B9E8',
        bg: '#FFF8F7',
        text: '#2E2E2E',
        textMuted: '#6B6B6B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        '44': '44px', // Minimum tap target size
      },
      minWidth: {
        '44': '44px', // Minimum tap target size
      },
    },
  },
  plugins: [],
}

export default config
