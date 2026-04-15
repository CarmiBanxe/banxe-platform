# CLAUDE.md — banxe-platform
# BANXE AI Bank — Web + Mobile UI/UX Monorepo
# IL-UI-01 | Phase 7 | FCA-authorised EMI

## Architecture

```
banxe-platform/
├── packages/shared/   TypeScript types, API client, Zustand stores
├── packages/web/      Next.js 15 (App Router) — 8 pages, Tailwind v4
├── packages/mobile/   Expo SDK 53 (expo-router) — 7 screens, NativeWind
└── turbo.json         Turborepo pipeline
```

## Backend connection

- API: `http://localhost:8000` (banxe-emi-stack FastAPI)
- MCP: `http://localhost:9100/mcp` (banxe_mcp — 28 tools)
- All amounts as **string Decimals** — NEVER float (FCA I-01)

## Brand tokens

```
primary:  #1A2B6B  (BANXE navy)
accent:   #00C6AE  (BANXE teal)
bg:       #F5F7FA
surface:  #FFFFFF
text:     #1A1A2E
error:    #DC2626
success:  #16A34A
warning:  #F59E0B
```

## Hard rules

1. **No float for money** — all amounts as `DecimalString` (string)
2. **No raw card numbers** — masked PAN only (`•••• •••• •••• 1234`)
3. **PSD2 SCA** — biometric/OTP confirmation on all transfers
4. **WCAG 2.1 AA** — contrast ratios, ARIA labels, keyboard nav
5. **GDPR** — consent screens, no PII in logs
6. **Session timeout** — warn at 5min, auto-logout at 10min
7. **Auth guard** — all authenticated pages behind `AuthGuard`
8. **No secrets in code** — all config via `.env.local`

## Dev commands

```bash
pnpm dev                # start all packages
pnpm --filter @banxe/web dev       # web only (:3001)
pnpm --filter @banxe/mobile dev    # expo only
pnpm test              # all tests
pnpm typecheck         # TypeScript check
```

## Infrastructure Checklist (IL-UI-01)
- [x] .semgrep/typescript-banking.yml — TS SAST rules
- [x] n8n/workflows/ui-deploy-notification.json — deploy alerts
- [x] docker/web.Dockerfile — containerised web app
- [x] infra/grafana/dashboards/frontend-metrics.json — Core Web Vitals
- [x] CLAUDE.md (root + web + mobile)
- [x] .ai/registries/ (ui-map, web-map, mobile-map, shared-map)
- [x] .ai/soul.md — UI platform soul

## UI Skills

Use these skills for all UI generation and modification tasks:

- `banxe-ui-rules`: BANXE financial UX conventions, compliance disclosures, decimal-safe amount handling, PSD2/GDPR/KYC UI constraints.
- `material-3`: MD3 semantic roles, token mapping, component semantics, shape/elevation/accessibility rules.
- `ui-sync`: parallel web + mobile generation discipline across `packages/web` and `packages/mobile`.

### UI generation policy
- Always use BANXE tokens from this file as source of truth.
- Always apply BANXE regulatory UX rules before visual polish.
- Always map BANXE tokens to MD3 semantic roles rather than inventing new visual tokens.
- Always generate or update web and mobile in parallel unless explicitly instructed otherwise.
- Never use float-based money formatting in UI logic.

## Related repos
- banxe-emi-stack: `/home/mmber/banxe-emi-stack` (backend)
- banxe-architecture: `github.com/CarmiBanxe/banxe-architecture`
