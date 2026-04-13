/**
 * packages/shared/src/tokens/breakpoints.ts
 * BANXE AI Bank — Responsive Breakpoints
 * IL-UI-01
 *
 * Mobile-first breakpoints aligned with Tailwind CSS defaults.
 * Mobile: < 640px (default styles apply)
 * Tablet: ≥ 768px
 * Desktop: ≥ 1024px
 * Wide: ≥ 1280px
 */

export const breakpoints = {
  // ── Min-width breakpoints (mobile-first) ─────────────────────────────────
  sm: '640px',    // small devices (landscape phones)
  md: '768px',    // tablets
  lg: '1024px',   // desktops / laptops
  xl: '1280px',   // large desktops
  '2xl': '1536px', // ultra-wide displays

  // ── Numeric values (for programmatic use in React Native) ─────────────────
  numeric: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const

/**
 * Container max-widths for each breakpoint.
 * Aligned with Tailwind CSS `max-w-screen-*` utilities.
 */
export const containerWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const

/**
 * z-index scale for layering control.
 * Prevents z-index wars across components.
 */
export const zIndex = {
  below: '-1',
  base: '0',
  raised: '1',
  dropdown: '100',
  sticky: '200',
  overlay: '300',
  modal: '400',
  toast: '500',
  tooltip: '600',
} as const

export type BreakpointToken = keyof typeof breakpoints.numeric
