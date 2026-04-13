# CLAUDE.md — packages/shared
# Shared Package — Design Tokens, Types, API Client, Zustand Stores | BANXE AI Bank

## Role

This package is the **single source of truth** for all cross-platform code:
- Design tokens (consumed by web via Tailwind, by mobile via StyleSheet)
- TypeScript types (mirrors Pydantic models from banxe-emi-stack)
- API client (all HTTP calls to banxe-emi-stack FastAPI)
- Zustand stores (auth, account, transaction — shared between web + mobile)

## Structure

```
packages/shared/src/
├── tokens/             # Design system tokens (S14-05)
│   ├── colors.ts       # brand, semantic, FCA compliance colours
│   ├── typography.ts   # Inter/Roboto, 4pt scale xs=12px→5xl=48px
│   ├── spacing.ts      # 4pt grid, 44px touch target, 48px input height
│   ├── breakpoints.ts  # mobile-first sm=640px→2xl=1536px, zIndex scale
│   └── index.ts        # barrel export
├── types/              # TypeScript type definitions
│   ├── api.ts          # ApiResult<T>, PaginatedResponse, ApiError
│   ├── auth.ts         # LoginRequest, TokenResponse, AuthUser, SCAChallenge
│   ├── account.ts      # Account, Balance, Transaction, Statement
│   ├── kyc.ts          # KYCSubmission, KYCStatusResponse
│   └── compliance.ts   # ComplianceDashboard, AMLScreening, ReconResult
├── store/              # Zustand state stores
│   ├── authStore.ts    # useAuthStore — auth, SCA challenge, token refresh
│   ├── accountStore.ts # useAccountStore — accounts, balances, selection
│   └── transactionStore.ts # useTransactionStore — pagination, filters
├── api-client.ts       # authApi, accountsApi, transactionsApi, kycApi, complianceApi
├── design-tokens.ts    # Legacy barrel (kept for backwards compatibility)
└── index.ts            # Main barrel export
```

## Key Invariants

### I-01 — Decimal Strings (CRITICAL)
All monetary amounts are `DecimalString` (string), NEVER `number` or `float`.
Rationale: JavaScript float precision causes rounding errors in financial calculations.

```typescript
// ✅ CORRECT
const amount: DecimalString = "150.00"

// ❌ WRONG — never do this
const amount: number = 150.00
```

### I-05 — ApiResult<T> (MANDATORY)
All API client functions return `ApiResult<T>`. Always check `.ok` before accessing `.data`.

```typescript
const result = await authApi.login(req)
if (!result.ok) {
  handleError(result.error)  // result.error: ApiError
  return
}
const token = result.data.access_token  // only after ok check
```

### I-SCA — SCA Challenge Handling
When `authApi.login()` or `transactionsApi.initiate()` returns HTTP 202, it includes
a `SCAChallenge`. The calling component must display SCA UI before proceeding.

## Design Tokens Usage

### Web (Tailwind CSS)
Tokens are referenced via CSS variables or Tailwind config mapping.
Prefer Tailwind classes; use `colors.*` tokens only for JS-driven styles.

### Mobile (React Native StyleSheet)
Import directly from `@banxe/shared`:
```typescript
import { colors, spacing, typography } from '@banxe/shared'

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    minHeight: parseInt(spacing.touchTarget),  // 44px — WCAG 2.5.5
    borderRadius: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textInverted,
  },
})
```

## Backend Sync

Types in `src/types/` mirror Pydantic models in banxe-emi-stack.
When backend models change, update these files in sync:

| Backend model file | Frontend types file |
|-------------------|---------------------|
| `api/models/customers.py` | `types/account.ts` |
| `api/models/kyc.py` | `types/kyc.ts` |
| `services/auth/two_factor.py` | `types/auth.ts` (SCAChallenge) |
| `api/routers/compliance.py` | `types/compliance.ts` |

## Registries

See `.ai/registries/` for detailed maps:
- `shared-map.md` — module overview
- `types-map.md` — all type definitions
- `store-map.md` — Zustand store documentation
- `api-map.md` — API client methods
- `tokens-map.md` — design token reference
- `integration-map.md` — emi-stack integration contract

## FCA / Regulatory Notes

- `SCAChallenge` type implements PSD2 Art.97 SCA challenge contract
- `DecimalString` prevents float precision errors in financial reporting
- All compliance-relevant fields are typed explicitly (never `any`)
- `colors.fcaWarning` / `colors.fcaCompliant` — FCA-mandated status colours

*Last updated: 2026-04-13 (S14-FIX-3)*
