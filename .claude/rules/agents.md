---
paths: ["**"]
alwaysApply: true
---

# Agent Rules — BANXE UI Platform

## UI Tasks Checklist (MANDATORY before marking any UI task complete)

- [ ] `ui-sync` agent generated BOTH `packages/web` and `packages/mobile` versions unless explicitly waived by the user
- [ ] BANXE tokens from `CLAUDE.md` were used as the visual source of truth
- [ ] MD3 semantic roles were applied where appropriate (`material-3` skill)
- [ ] No hardcoded money logic using `float` / `number` / `parseFloat` / `toFixed`
- [ ] `DecimalString` formatting preserved in all financial UI (FCA I-01, I-05)
- [ ] Required disclosures are visible **before** irreversible actions
- [ ] GDPR consent UI preserved where required (unticked by default)
- [ ] PSD2 review → confirm step separation preserved (never collapsed)
- [ ] KYC/KYB regulated step order preserved
- [ ] Accessibility labels added to all interactive elements (WCAG 2.1 AA)
- [ ] Web and mobile props/state contracts remain aligned (`packages/shared` types used)
- [ ] Intentional platform divergences documented (navigation, gestures, safe-area only)
- [ ] `DESIGN.md` or `docs/` updated if component behavior changed
- [ ] Typecheck passed: `pnpm --filter @banxe/web typecheck`
- [ ] Typecheck passed: `pnpm --filter @banxe/mobile typecheck`
- [ ] Relevant tests updated or added for both platforms where applicable (`pnpm test`)

## Failure conditions
Do not mark a UI task complete if:
- Only one platform was updated without explicit CEO/user approval
- Tokens were bypassed with hardcoded visual values (`#hex` in component files)
- Amount formatting differs across `packages/web` and `packages/mobile`
- Regulated disclosures differ across platforms
- Component props drifted between web and mobile without documentation
- `float` / `number` used for any money value
- GDPR or PSD2 flow guards were removed or simplified

## Skills invocation order
For any UI generation or modification task:
1. `banxe-ui-rules` — apply financial compliance and UX rules
2. `material-3` — apply token → MD3 role mapping
3. `ui-sync` — execute parallel web + mobile generation

## Agents
| Agent | Trigger | Scope |
|-------|---------|-------|
| `ui-sync` | Any UI component create/modify | Parallel web+mobile generation |
