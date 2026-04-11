# CLAUDE.md — packages/web
# Next.js 15 Web Application — BANXE AI Bank

## Stack
- Next.js 15 (App Router, server + client components)
- React 19
- Tailwind CSS v4 (CSS-first config via @theme)
- TypeScript 5.4 strict
- Zustand (shared stores from @banxe/shared)
- Vitest + Testing Library for tests

## Pages (src/app/)
| Route | Page | Auth |
|-------|------|------|
| /auth/login | Email + 6-digit PIN login | Public |
| /dashboard | Balance cards + quick actions | Auth |
| /transfers | IBAN + amount + PSD2 SCA 2-step | Auth |
| /transactions | Paginated list with filters | Auth |
| /kyc | Document upload + liveness (4-step wizard) | Auth |
| /compliance | FCA recon + AML dashboard | Auth |
| /settings | Profile + biometric toggle | Auth |
| /statements | Period selector + PDF download | Auth |

## Component hierarchy (Atomic Design)
```
atoms/      Button, Badge, Skeleton
molecules/  TransactionRow, Card, AccountSelector, StatusBadge
organisms/  DashboardHeader, TransferForm, TransactionList, CompliancePanel
layout/     AuthGuard (session timeout), Sidebar, TopNav, MobileNav
```

## Rules
- Mobile-first responsive: min 320px
- All money amounts: string only, never number/float
- No raw IBAN/PAN display without masking
- ARIA labels on all interactive elements
- Test: every page has at least 1 test
