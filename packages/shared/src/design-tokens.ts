/**
 * packages/shared/src/design-tokens.ts
 * BANXE AI Bank — Design System Tokens
 * Single source of truth for web (Tailwind CSS variables) and mobile (NativeWind)
 * IL-UI-01
 */

export const colors = {
  primary: '#1A2B6B',      // BANXE navy blue
  accent: '#00C6AE',       // BANXE teal
  bg: '#F5F7FA',           // page background
  surface: '#FFFFFF',      // card/modal surface
  text: '#1A1A2E',         // primary text
  textMuted: '#6B7280',    // secondary text
  error: '#DC2626',        // FCA red for alerts/breaches
  success: '#16A34A',      // MATCHED / OK states
  warning: '#F59E0B',      // DISCREPANCY / warnings
  info: '#3B82F6',         // informational

  // State colours
  hover: '#162460',        // primary darkened 5%
  active: '#112058',       // primary darkened 10%
  disabled: '#D1D5DB',     // grayed out
  disabledText: '#9CA3AF',

  // Semantic (FCA compliance)
  matched: '#16A34A',      // reconciliation MATCHED
  discrepancy: '#F59E0B',  // reconciliation DISCREPANCY
  breach: '#DC2626',       // FCA breach
  pending: '#6B7280',      // awaiting data
} as const

export const typography = {
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Roboto, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.25',
    base: '1.5',
    relaxed: '1.75',
  },
} as const

/** 4-point spacing grid */
export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
} as const

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  pill: '9999px',
} as const

export const shadows = {
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  button: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  focus: '0 0 0 3px rgb(0 198 174 / 0.4)',  // accent ring
} as const

/** WCAG 2.1 AA contrast ratios verified */
export const wcag = {
  contrastRatioAA: 4.5,
  contrastRatioAALarge: 3.0,
  focusVisible: `3px solid ${colors.accent}`,
  minimumTouchTarget: '44px',
} as const

export type ColorKey = keyof typeof colors
export type SpacingKey = keyof typeof spacing
