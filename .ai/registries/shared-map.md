# Shared Map — packages/shared
# TypeScript types + API client + Zustand stores | IL-UI-01

## Exports

| Module | File | Contents |
|--------|------|---------|
| Design tokens | src/design-tokens.ts | colors, typography, spacing, borderRadius, shadows |
| API types | src/types/api.ts | ApiResponse, PaginatedResponse, ApiError, ApiResult |
| Auth types | src/types/auth.ts | LoginRequest, TokenResponse, AuthUser, SCAChallenge |
| Account types | src/types/account.ts | Account, Balance, Transaction, Statement |
| KYC types | src/types/kyc.ts | KYCSubmission, KYCStatusResponse |
| Compliance types | src/types/compliance.ts | ComplianceDashboard, AMLScreening, ReconResult |
| API client | src/api-client.ts | authApi, accountsApi, transactionsApi, kycApi, complianceApi |
| Auth store | src/store/authStore.ts | useAuthStore (Zustand) |
| Account store | src/store/accountStore.ts | useAccountStore (Zustand) |
| Transaction store | src/store/transactionStore.ts | useTransactionStore (Zustand) |

## Key invariants

- All monetary amounts: `DecimalString` (string) — never `number` or `float`
- API client returns `ApiResult<T>`: `{ ok: true, data }` | `{ ok: false, error }`
- Stores shared between web and mobile — single source of truth

*Last updated: 2026-04-11*
