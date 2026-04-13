# ROADMAP — Banxe Platform (banxe-platform)

> **Legend:** ✅ DONE | 🔄 IN PROGRESS | ⏳ PENDING | 🔒 BLOCKED (external dependency)
>
> banxe-platform is the frontend monorepo for BANXE AI Bank.
> Backend: banxe-emi-stack (FastAPI, 78 endpoints, 87% coverage)
> Frontend: Next.js 15 (web) + Expo SDK 53 (mobile)

---

## Phase 1 — Foundation ✅ COMPLETE

Monorepo scaffold, shared types, design tokens, basic auth.

| # | Feature | Sprint | Status | Standard |
|---|---------|--------|--------|---------|
| 1 | Monorepo scaffold (pnpm workspaces) | S1 | ✅ | IL-UI-01 |
| 2 | packages/shared — TypeScript types (api, auth, account, kyc, compliance) | S1 | ✅ | IL-UI-01 |
| 3 | packages/shared — API client (authApi, accountsApi, transactionsApi, kycApi) | S1 | ✅ | IL-UI-01 |
| 4 | packages/shared — Zustand stores (authStore, accountStore, transactionStore) | S1 | ✅ | IL-UI-01 |
| 5 | packages/web — Next.js 15 App Router scaffold | S1 | ✅ | IL-UI-01 |
| 6 | packages/mobile — Expo SDK 53 scaffold | S1 | ✅ | IL-UI-01 |

---

## Phase 2 — Web App ✅ COMPLETE

Next.js 15 pages, layout, auth guard, core components.

| # | Feature | Sprint | Status | Notes |
|---|---------|--------|--------|-------|
| 7 | Auth login page | S2 | ✅ | JWT + SCA challenge |
| 8 | AuthGuard HOC — route protection | S2 | ✅ | Reads authStore |
| 9 | Dashboard page | S2 | ✅ | Account balances |
| 10 | Transactions page | S3 | ✅ | Paginated list |
| 11 | Transfers page | S3 | ✅ | Payment initiation |
| 12 | KYC page | S4 | ✅ | Submission + status poll |
| 13 | Compliance page | S4 | ✅ | AML dashboard (staff-only) |
| 14 | Settings page | S4 | ✅ | Profile, 2FA |
| 15 | Statements page | S5 | ✅ | Download PDF |
| 16 | Atom components: Button, Badge, Skeleton | S5 | ✅ | WCAG 2.1 AA |
| 17 | Molecule components: TransactionRow | S5 | ✅ | — |

---

## Phase 3 — Mobile App ✅ COMPLETE

Expo SDK 53 screens, tab navigation, KYC flow.

| # | Feature | Sprint | Status | Notes |
|---|---------|--------|--------|-------|
| 18 | Root layout + auth gate | S6 | ✅ | Expo Router |
| 19 | Tab navigation: Dashboard, Transactions, Transfers, Settings | S6 | ✅ | — |
| 20 | Auth / Onboarding screen | S6 | ✅ | First-run flow |
| 21 | KYC screen | S7 | ✅ | Submit + status |
| 22 | Cards screen | S7 | ✅ | Virtual/physical cards |

---

## Phase 4 — Design System ✅ COMPLETE

Design tokens, shared between web (Tailwind) and mobile (StyleSheet).

| # | Feature | Sprint | Status | Notes |
|---|---------|--------|--------|-------|
| 23 | Color tokens — brand, semantic, FCA compliance | S8 | ✅ | WCAG 4.5:1 contrast |
| 24 | Typography tokens — Inter/Roboto, 4pt scale | S8 | ✅ | 12px minimum body |
| 25 | Spacing tokens — 4pt grid, borderRadius, shadows | S8 | ✅ | 44px touch target |
| 26 | Breakpoint tokens — mobile-first, zIndex scale | S8 | ✅ | sm=640px→2xl=1536px |

---

## Phase 5 — Registry & Documentation ✅ COMPLETE

`.ai/registries/` — 12 machine-readable maps for AI-assisted development.

| # | Feature | Sprint | Status | Notes |
|---|---------|--------|--------|-------|
| 27 | shared-map.md — types, stores, API client | S9 | ✅ | — |
| 28 | web-map.md — Next.js pages and components | S9 | ✅ | — |
| 29 | mobile-map.md — Expo screens and navigation | S9 | ✅ | — |
| 30 | ui-map.md — design system components | S9 | ✅ | — |
| 31 | tokens-map.md — design token reference | S10 | ✅ | — |
| 32 | auth-map.md — authentication flow documentation | S10 | ✅ | — |
| 33 | types-map.md — TypeScript type catalogue | S10 | ✅ | — |
| 34 | store-map.md — Zustand store documentation | S10 | ✅ | — |
| 35 | api-map.md — frontend API client reference | S10 | ✅ | — |
| 36 | integration-map.md — emi-stack integration contract | S10 | ✅ | — |
| 37 | compliance-map.md — FCA/PSD2 regulatory features | S10 | ✅ | — |
| 38 | sca-map.md — PSD2 SCA flow documentation | S10 | ✅ | — |

---

## Phase 6 — PSD2 Compliance ✅ COMPLETE (Stubs)

Strong Customer Authentication (SCA) — PSD2 Art.97.

| # | Feature | Sprint | Status | FCA ref | Stub blocker |
|---|---------|--------|--------|---------|-------------|
| 39 | SCAChallenge.tsx — web modal (biometric + OTP) | S14-08 | ✅ | PSD2 Art.97 | WebAuthn full impl |
| 40 | sca/index.tsx — mobile screen (expo-local-authentication) | S14-08 | ✅ | PSD2 Art.97 | Biometric POST to /auth/sca |
| 41 | Payment SCA trigger (POST /v1/payments → 202 + challenge) | S14-08 | ✅ | PSR 2017 Reg.71 | Wire SCA modal in transfers page |

---

## Phase 7 — Production Hardening 🔄 IN PROGRESS

Wire SCA flow end-to-end, replace stubs, accessibility audit, Vercel deploy.

| # | Feature | Sprint | Status | FCA ref | Notes |
|---|---------|--------|--------|---------|-------|
| 42 | Wire SCA modal in transfers page (web) | S15 | ⏳ | PSR 2017 Reg.71 | Detect 202 response → show SCAChallenge |
| 43 | Wire SCA screen in mobile transfers | S15 | ⏳ | PSR 2017 Reg.71 | router.push('/sca', params) |
| 44 | WebAuthn full implementation (web biometric) | S15 | ⏳ | PSD2 Art.4(30) | navigator.credentials.get() |
| 45 | POST biometric proof to /auth/sca (mobile) | S15 | ⏳ | PSD2 Art.4(30) | After expo-local-auth success |
| 46 | Silent token refresh (T-2 min) | S15 | ⏳ | PSD2 RTS Art.10 | authApi.refreshToken() |
| 47 | Inactivity timeout re-auth (5 min) | S15 | ⏳ | PSD2 RTS Art.11 | authStore inactivity timer |
| 48 | WCAG 2.1 AA accessibility full audit | S15 | ⏳ | WCAG 2.1 | axe-core integration test |
| 49 | E2E tests (Playwright web + Detox mobile) | S15 | ⏳ | — | At least 20 E2E scenarios |
| 50 | Vercel production deploy | S15 | ⏳ | — | Preview on PR, prod on main |
| 51 | EAS Build — iOS + Android production build | S15 | ⏳ | — | TestFlight + Play Store internal |
| 52 | Error boundary + fallback UI | S16 | ⏳ | — | — |
| 53 | Push notifications (FCM) — SCA push method | S16 | ⏳ | PSD2 Art.4(30) | Possession factor |
| 54 | Open Banking ASPSP dashboard | S16 | 🔒 | PSD2 Art.66-67 | Awaiting PIS/AIS licence |

---

## Compliance Checklist

| Requirement | Implemented | Test coverage |
|-------------|-------------|---------------|
| PSD2 Art.97 SCA for payments > £30 | ✅ Stub | Unit (banxe-emi-stack) |
| PSD2 Art.97 SCA for new device | ✅ Stub | Partial |
| PSD2 RTS Art.10 token TTL ≤ 15 min | ⏳ Pending | — |
| PSD2 RTS Art.11 inactivity re-auth | ⏳ Pending | — |
| WCAG 2.1 AA contrast (4.5:1) | ✅ Tokens verified | Manual |
| WCAG 2.5.5 touch target ≥ 44px | ✅ spacing.touchTarget | Manual |
| GDPR Art.22 automated decision transparency | ✅ ReasoningBank (backend) | banxe-emi-stack |

---

*Last updated: 2026-04-13 (Sprint 14 — Phase 7 opened)*
