/**
 * packages/shared/src/tokens/spacing.ts
 * BANXE AI Bank — Spacing Design Tokens
 * IL-UI-01
 *
 * 4pt grid system. All spacing values are multiples of 4px.
 * Mobile touch targets: minimum 44×44px (WCAG 2.5.5 / Apple HIG).
 */

export const spacing = {
  // ── Base 4pt Grid ─────────────────────────────────────────────────────────
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',

  // ── Semantic Aliases ─────────────────────────────────────────────────────
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',

  // ── Component-specific ───────────────────────────────────────────────────
  touchTarget: '44px',     // WCAG 2.5.5 minimum touch target
  inputHeight: '48px',     // form input height
  buttonHeight: '44px',    // button minimum height
  cardPadding: '16px',     // card internal padding
  pagePadding: '24px',     // page / screen horizontal padding
  sectionGap: '32px',      // gap between page sections
} as const

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  pill: '9999px',  // fully rounded (badges, chips)
  full: '50%',     // circle (avatars)
} as const

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  card: '0 2px 8px rgba(0,0,0,0.08)',
  modal: '0 8px 32px rgba(0,0,0,0.16)',
  button: '0 1px 3px rgba(0,0,0,0.12)',
  focus: '0 0 0 3px rgba(0,198,174,0.4)',  // accent focus ring
} as const

export type SpacingToken = keyof typeof spacing
