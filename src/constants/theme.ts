export const COLORS = {
  background: '#0a0a1a',
  surface: '#141428',
  surfaceLight: '#1e1e3a',
  primary: '#6c5ce7',
  primaryLight: '#a29bfe',
  secondary: '#00cec9',
  accent: '#fd79a8',
  gold: '#fdcb6e',
  text: '#ffffff',
  textSecondary: '#a0a0b8',
  textMuted: '#6c6c80',
  success: '#00b894',
  warning: '#ffeaa7',
  error: '#ff6b6b',
  border: '#2d2d4a',

  rarity: {
    normal: '#a0a0b8',
    rare: '#74b9ff',
    epic: '#a29bfe',
    legendary: '#fdcb6e',
  },
} as const

export const FONTS = {
  digital: 'monospace',
  display: 'System',
  body: 'System',
} as const

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const
