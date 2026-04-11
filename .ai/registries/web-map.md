# Web Map — packages/web
# Next.js 15 App Router | IL-UI-01

## Pages

| Route | File | Auth | API calls |
|-------|------|------|-----------|
| /auth/login | app/auth/login/page.tsx | Public | POST /v1/auth/login |
| /dashboard | app/dashboard/page.tsx | Required | GET /v1/ledger/accounts, GET .../balance |
| /transfers | app/transfers/page.tsx | Required | POST /v1/payments (PSD2 SCA 2-step) |
| /transactions | app/transactions/page.tsx | Required | GET /v1/transactions |
| /kyc | app/kyc/page.tsx | Required | POST /v1/kyc/submit |
| /compliance | app/compliance/page.tsx | Required | GET /v1/compliance/dashboard |
| /settings | app/settings/page.tsx | Required | PATCH /v1/profile |
| /statements | app/statements/page.tsx | Required | GET /v1/statements/{id} |

## Components (Atomic Design)

| Atom | Path |
|------|------|
| Button | components/atoms/Button.tsx |
| Badge | components/atoms/Badge.tsx |
| Skeleton | components/atoms/Skeleton.tsx |

| Molecule | Path |
|----------|------|
| TransactionRow | components/molecules/TransactionRow.tsx |

| Layout | Path |
|--------|------|
| AuthGuard | components/layout/AuthGuard.tsx |

## Tests
- tests/web/auth.test.tsx
- tests/web/dashboard.test.tsx
- tests/web/transfers.test.tsx
- tests/web/compliance.test.tsx

*Last updated: 2026-04-11*
