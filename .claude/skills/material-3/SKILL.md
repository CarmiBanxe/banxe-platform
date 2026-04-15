---
name: material-3
description: Material Design 3 compliance layer for BANXE UI generation. Use for all UI generation to map BANXE design tokens to MD3 semantic roles across web and mobile.
---

# Material 3 for BANXE

This skill applies Material Design 3 semantics to BANXE UI without replacing BANXE brand tokens.

## Purpose
Use MD3 as a semantic compliance layer — color roles, typography roles, shape roles, state semantics, accessibility pairings.

BANXE tokens (from `CLAUDE.md`) remain the **brand source of truth**.
MD3 roles remain the **semantic UI source of truth**.

## Web implementation note
[ФАКТ] `@material/web` is limited and in maintenance mode — it does NOT fully match Compose/Flutter Material 3 behavior.
[ВЫВОД] For `packages/web` (Next.js 15 + Tailwind v4): use CSS custom properties `--md-sys-color-*` as semantic layer, styled via Tailwind utilities and BANXE wrapper components. Do not rely on `@material/web` for app-wide scaffolding.

## Mapping policy
Do not invent colors from scratch when BANXE tokens exist.
Map BANXE tokens into MD3 semantic roles first.

## BANXE → MD3 baseline mapping

From `CLAUDE.md` brand tokens:
```
primary:   #1A2B6B  (BANXE navy)
accent:    #00C6AE  (BANXE teal)
bg:        #F5F7FA
surface:   #FFFFFF
text:      #1A1A2E
error:     #DC2626
success:   #16A34A
warning:   #F59E0B
```

Semantic mapping:
| MD3 role | BANXE token |
|----------|-------------|
| `--md-sys-color-primary` | primary `#1A2B6B` |
| `--md-sys-color-secondary` | accent `#00C6AE` |
| `--md-sys-color-surface` | surface `#FFFFFF` |
| `--md-sys-color-on-surface` | text `#1A1A2E` |
| `--md-sys-color-error` | error `#DC2626` |
| `--md-sys-color-background` | bg `#F5F7FA` (platform layer) |

Do not use BANXE Accent (`#00C6AE`) as a replacement for every secondary and tertiary role without checking contrast and purpose.
Warning (`#F59E0B`) and Success (`#16A34A`) map to MD3 custom roles, not directly to standard system roles.

## Required role families
When generating themes, define at minimum:
- `primary` / `on-primary` / `primary-container` / `on-primary-container`
- `secondary` / `on-secondary` / `secondary-container` / `on-secondary-container`
- `error` / `on-error` / `error-container` / `on-error-container`
- `surface` / `on-surface` / `on-surface-variant`
- `surface-container-lowest`
- `surface-container-low`
- `surface-container`
- `surface-container-high`
- `surface-container-highest`
- `outline`
- `outline-variant`
- `inverse-surface` / `inverse-on-surface` / `inverse-primary`

## Pairing rules
[ФАКТ] MD3 color roles must be used in their intended pairs — using arbitrary text on arbitrary container color breaks contrast and adaptive behavior.
[ВЫВОД] Only use intended role pairings:

| Foreground | Background |
|-----------|-----------|
| `on-primary` | `primary` |
| `on-primary-container` | `primary-container` |
| `on-secondary-container` | `secondary-container` |
| `on-surface` / `on-surface-variant` | `surface` / `surface-container-*` |
| `on-error` | `error` |
| `on-error-container` | `error-container` |

Never place arbitrary text color on arbitrary container color.

## Web guidance (`packages/web`)
- Use CSS custom properties: `--md-sys-color-primary`, etc.
- Style components with Tailwind v4 utilities referencing these CSS vars.
- Wrapper components are preferred — don't reach for `@material/web` elements directly.
- Example pattern:
  ```tsx
  // Use semantic var, not hardcoded hex
  className="bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]"
  ```

## Mobile guidance (`packages/mobile`)
- Apply the same semantic mapping conceptually in NativeWind / React Native styles.
- Safe-area, touch target size (min 44×44pt), and native navigation may differ by platform.
- Preserve the same role names as comments so the mapping stays traceable.

## Typography guidance (MD3 type scale)
Map BANXE typography onto MD3 roles:
| MD3 role | When to use |
|---------|------------|
| Display | Rare dashboard highlights only |
| Headline | Page and section headers |
| Title | Cards, dialogs, section labels |
| Body | Descriptions, financial details, balances |
| Label | Buttons, chips, tabs, compact metadata, amounts in lists |

Do not create ad-hoc font sizes when an MD3 role fits.

## Shape guidance (MD3 shape scale)
| Shape | Use for |
|-------|---------|
| Full | Buttons, pills, FABs |
| Small | Text fields, menus, chips |
| Medium | Cards, dialogs |
| Large/XL | Bottom sheets, side sheets |

Do not hardcode `border-radius` values when a semantic token can express the intent.

## Elevation guidance
MD3 uses **tonal surfaces** as the primary elevation cue.
- Prefer `surface-container-*` roles over stacking box shadows.
- Use shadows only when strong separation is needed (e.g., sticky headers, modals).

## BANXE-specific overrides
When BANXE regulatory UX conflicts with generic Material 3 examples:
- BANXE regulatory UX wins
- Disclosure clarity wins
- `DecimalString` money wins
- PSD2 review → confirm two-step wins

## Anti-patterns
Never:
- Hardcode `#1A2B6B` inside component files when `--md-sys-color-primary` or a BANXE Tailwind token exists
- Mix MD2 naming (`--mdc-*`) with MD3 roles (`--md-sys-*`)
- Use `outline` instead of `outline-variant` for dividers
- Let MD3 decorative styling override regulated business meaning
- Apply visual MD3 patterns that obscure financial clarity

## Default task behavior
For any component task:
1. Read BANXE tokens from `CLAUDE.md`
2. Map BANXE tokens to MD3 roles (table above)
3. Apply MD3 role pairings (foreground/background pairs)
4. Generate both `packages/web` and `packages/mobile` implementations
5. Verify contrast meets WCAG 2.1 AA and state consistency
