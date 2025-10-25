export const colors = {
  primary: '#FF6B81',
  accent: '#FF9671',
  highlight: '#FFD6A5',
  secondary: '#C5B9E8',
  bg: '#FFF8F7',
  text: '#2E2E2E',
  textMuted: '#6B6B6B',
} as const

export type ColorKey = keyof typeof colors
