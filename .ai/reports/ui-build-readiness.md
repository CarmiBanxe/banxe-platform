# UI Build Readiness Report
# IL-UI-01 | Generated: 2026-04-11

## Status: SCAFFOLD COMPLETE — install dependencies to run

## Packages

| Package | Status | Notes |
|---------|--------|-------|
| @banxe/shared | ✅ Ready | Types + stores + API client — pure TypeScript |
| @banxe/web | ✅ Scaffold | 8 pages, 5 components, needs `pnpm install` |
| @banxe/mobile | ✅ Scaffold | 7 screens, needs `pnpm install` + Expo CLI |

## Pages (web — 8/8)
- [x] /auth/login — email + PIN form, PSD2 SCA notice
- [x] /dashboard — balance cards, quick actions
- [x] /transfers — IBAN + amount + SCA 2-step
- [x] /transactions — paginated list with filters
- [x] /kyc — 4-step document/selfie wizard
- [x] /compliance — FCA recon + AML dashboard
- [x] /settings — profile + biometric toggle
- [x] /statements — period selector + PDF download

## Screens (mobile — 7/7)
- [x] Onboarding — 3-slide Reanimated animation
- [x] Dashboard — balance card, pull-to-refresh
- [x] Transfers — biometric SCA confirmation
- [x] Transactions — FlatList, pull-to-refresh
- [x] Settings — biometric switch, haptics
- [x] KYC — 4-step modal
- [x] Cards — masked PAN only

## Infrastructure Checklist
- [x] Semgrep SAST rules
- [x] Docker web.Dockerfile
- [x] Grafana frontend-metrics dashboard
- [x] n8n deploy notification workflow
- [x] 3× CLAUDE.md (root, web, mobile)
- [x] 4× AI registries
- [x] .ai/soul.md

## To run

```bash
cd /home/mmber/banxe-platform
pnpm install
pnpm --filter @banxe/web dev    # http://localhost:3001
pnpm --filter @banxe/mobile dev # Expo DevTools
pnpm test
```
