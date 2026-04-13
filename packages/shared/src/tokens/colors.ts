/**
 * packages/shared/src/tokens/colors.ts
 * BANXE AI Bank — Color Design Tokens
 * IL-UI-01 | WCAG 2.1 AA compliant
 *
 * Source of truth for brand, semantic, and state colours.
 * Used by web (CSS custom properties / Tailwind) and mobile (NativeWind).
 */

export const colors = {
  // ── Brand ────────────────────────────────────────────────────────────────
  primary: '#1A2B6B',       // BANXE navy blue (logo)
  primaryLight: '#2D47A8',  // lighter primary for hover states
  accent: '#00C6AE',        // BANXE teal
  accentLight: '#00E4CA',   // lighter teal

  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg: '#F5F7FA',            // page / screen background
  surface: '#FFFFFF',       // card, modal, input surface
  surfaceAlt: '#F0F4F8',    // secondary surface (sidebar, panels)

  // ── Text ─────────────────────────────────────────────────────────────────
  text: '#1A1A2E',          // primary text — 4.5:1 on bg (WCAG AA)
  textMuted: '#6B7280',     // secondary / caption text
  textInverted: '#FFFFFF',  // on dark/primary backgrounds

  // ── Semantic ─────────────────────────────────────────────────────────────
  error: '#DC2626',         // FCA breach / error state
  errorLight: '#FEF2F2',    // error background tint
  success: '#16A34A',       // matched / approved state
  successLight: '#F0FDF4',  // success background tint
  warning: '#F59E0B',       // discrepancy / pending risk
  warningLight: '#FFFBEB',  // warning background tint
  info: '#3B82F6',          // informational
  infoLight: '#EFF6FF',     // info background tint

  // ── State ────────────────────────────────────────────────────────────────
  hover: '#162460',         // primary hover (darkened 5%)
  active: '#112058',        // primary active (darkened 10%)
  focus: '#00C6AE',         // focus ring (same as accent — WCAG 2.4.7)
  disabled: '#D1D5DB',      // disabled background
  disabledText: '#9CA3AF',  // disabled text

  // ── FCA / Compliance Semantic ────────────────────────────────────────────
  matched: '#16A34A',       // recon MATCHED (FCA CASS)
  discrepancy: '#F59E0B',   // recon DISCREPANCY
  breach: '#DC2626',        // FCA safeguarding breach
  pending: '#6B7280',       // awaiting processing
  flagged: '#EF4444',       // AML / compliance flagged

  // ── Borders ──────────────────────────────────────────────────────────────
  border: '#E5E7EB',        // default border
  borderStrong: '#D1D5DB',  // emphasis border
  borderFocus: '#00C6AE',   // focus border (accent)
} as const

export type ColorToken = keyof typeof colors
