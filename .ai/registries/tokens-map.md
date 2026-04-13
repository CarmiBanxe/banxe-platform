# Tokens Map — packages/shared/src/tokens
# Design System Token Registry | IL-UI-01 | S14-05

## Token Modules

| File | Exports | Purpose |
|------|---------|---------|
| `colors.ts` | `colors`, `ColorToken` | Brand, semantic, state, FCA compliance colours |
| `typography.ts` | `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `TypographyToken` | Type scale (xs→5xl), Inter/Roboto/JetBrains Mono |
| `spacing.ts` | `spacing`, `borderRadius`, `shadows`, `SpacingToken` | 4pt grid (0→128px), semantic aliases, component dimensions |
| `breakpoints.ts` | `breakpoints`, `containerWidths`, `zIndex`, `BreakpointToken` | Mobile-first (sm=640px→2xl=1536px), z-index scale |
| `index.ts` | re-exports all above | Barrel — import from `@banxe/shared` |

## Key Design Decisions

| Token | Value | Reason |
|-------|-------|--------|
| `colors.primary` | `#1A1A2E` | Banxe brand navy |
| `colors.accent` | `#00C6AE` | Banxe teal — FCA-accessible against white (4.8:1) |
| `colors.error` | `#DC2626` | PSD2 SCA failure / AML alert |
| `colors.fcaWarning` | `#92400E` | FCA regulatory warning text |
| `colors.fcaCompliant` | `#065F46` | FCA compliant status indicator |
| `spacing.touchTarget` | `44px` | WCAG 2.5.5 / Apple HIG minimum |
| `spacing.inputHeight` | `48px` | Form input — consistent across web + mobile |
| `spacing.buttonHeight` | `44px` | Button minimum height |
| `zIndex.modal` | `400` | Matches SCAChallenge `z-400` class |
| `zIndex.toast` | `500` | Always above modal |

## Usage

```typescript
// Web (Tailwind)
import { colors } from '@banxe/shared'
// Use via CSS variables or design token utilities

// Mobile (React Native)
import { colors, spacing } from '@banxe/shared'
const styles = StyleSheet.create({ button: { backgroundColor: colors.primary, minHeight: spacing.touchTarget } })
```

## Invariants

- All spacing values are multiples of 4px (4pt grid system)
- Colour contrast: accent (#00C6AE) on white = 4.8:1 — WCAG AA for normal text ✅
- Touch targets: minimum 44×44px on all interactive elements
- Font scale: 12px minimum for body text (WCAG 1.4.4)

*Last updated: 2026-04-13*
