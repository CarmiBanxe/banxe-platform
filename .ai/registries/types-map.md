# Types Map — TypeScript Type Definitions
# packages/shared/src/types/ | IL-UI-01

## Files

| File | Exports | Domain |
|------|---------|--------|
| `types/api.ts` | `ApiResponse`, `PaginatedResponse`, `ApiError`, `ApiResult` | Generic API wrapper types |
| `types/auth.ts` | `LoginRequest`, `TokenResponse`, `AuthUser`, `SCAChallenge`, `SCAConfirmation` | Auth & session |
| `types/account.ts` | `Account`, `Balance`, `Transaction`, `Statement` | Account & money types |
| `types/kyc.ts` | `KYCSubmission`, `KYCStatusResponse` | KYC workflow |
| `types/compliance.ts` | `ComplianceDashboard`, `AMLScreening`, `ReconResult` | Compliance & AML |

## API Wrapper Types (types/api.ts)

```typescript
type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError }
// Usage: always check ok before accessing data
```

## Account & Money Types (types/account.ts)

| Type | Key Fields | Notes |
|------|-----------|-------|
| `Account` | `account_id`, `iban`, `currency`, `status`, `balance` | EMI account |
| `Balance` | `available: DecimalString`, `reserved: DecimalString`, `currency` | String not number |
| `Transaction` | `tx_id`, `amount: DecimalString`, `direction`, `status`, `timestamp` | credit/debit |
| `Statement` | `account_id`, `period`, `transactions: Transaction[]`, `opening_balance`, `closing_balance` | Monthly |

## KYC Types (types/kyc.ts)

| Type | Key Fields | Notes |
|------|-----------|-------|
| `KYCSubmission` | `customer_id`, `first_name`, `last_name`, `dob`, `nationality`, `id_document` | Initial submission |
| `KYCStatusResponse` | `customer_id`, `status`, `workflow_state`, `created_at`, `updated_at` | Status poll |

KYC statuses: `PENDING` | `DOCUMENT_REVIEW` | `MLRO_REVIEW` | `APPROVED` | `REJECTED`

## Compliance Types (types/compliance.ts)

| Type | Key Fields | Notes |
|------|-----------|-------|
| `AMLScreening` | `customer_id`, `risk_score`, `pep_flag`, `sanctions_flag`, `screening_date` | AML result |
| `ComplianceDashboard` | `open_cases`, `high_risk_customers`, `pending_reviews`, `last_recon_at` | Dashboard stats |
| `ReconResult` | `period`, `matched`, `unmatched`, `discrepancies`, `status` | Reconciliation |

## Invariants

- **All monetary amounts are `DecimalString` (string), never `number`** — prevents float precision errors in financial calculations
- `ApiResult<T>` is the only allowed return type from API client functions — forces explicit error handling
- No `any` types — all responses are fully typed against banxe-emi-stack API contract
- Types are shared between web and mobile — single source of truth in `@banxe/shared`

## Sync with banxe-emi-stack

These types mirror Pydantic models in banxe-emi-stack. When backend models change, update here:
- `KYCStatus` enum → `types/kyc.ts`
- `CaseStatus` / `CaseOutcome` → extend `types/compliance.ts`
- New SCA method → extend `SCAChallenge.method` union

*Last updated: 2026-04-13*
