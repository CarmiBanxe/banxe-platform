/**
 * packages/shared/src/tokens/typography.ts
 * BANXE AI Bank — Typography Design Tokens
 * IL-UI-01 | WCAG 2.1 AA (1.4.4 Resize Text)
 *
 * 4pt scale typography system.
 * Web: CSS rem units | Mobile: React Native numeric sizes.
 */

export const typography = {
  // ── Font Families ─────────────────────────────────────────────────────────
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Roboto, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },

  // ── Font Sizes (px) ───────────────────────────────────────────────────────
  // 4pt scale starting at 12px
  sizes: {
    xs: '12px',    // caption, labels
    sm: '14px',    // body small, helper text
    base: '16px',  // body default (WCAG 1.4.4: resizable)
    lg: '18px',    // body large
    xl: '20px',    // subheading
    '2xl': '24px', // h3
    '3xl': '30px', // h2
    '4xl': '36px', // h1
    '5xl': '48px', // display / hero
  },

  // ── Font Weights ─────────────────────────────────────────────────────────
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // ── Line Heights ─────────────────────────────────────────────────────────
  leading: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // ── Letter Spacing ───────────────────────────────────────────────────────
  tracking: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    caps: '0.1em',  // used for ALL_CAPS labels
  },
} as const

export type FontSizeToken = keyof typeof typography.sizes
export type FontWeightToken = keyof typeof typography.weights
