# Store Map — Zustand State Management
# packages/shared/src/store/ | IL-UI-01

## Stores

| File | Hook | Domain | Shared |
|------|------|--------|--------|
| `store/authStore.ts` | `useAuthStore` | Auth session, SCA challenge | Web + Mobile |
| `store/accountStore.ts` | `useAccountStore` | Account list, selected account, balances | Web + Mobile |
| `store/transactionStore.ts` | `useTransactionStore` | Transaction history, filters, pagination | Web + Mobile |

## Auth Store (authStore.ts)

```typescript
interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  pendingChallenge: SCAChallenge | null
}
// Actions
login(credentials: LoginRequest): Promise<void>
logout(): void
setChallenge(challenge: SCAChallenge): void
clearChallenge(): void
refreshToken(): Promise<void>
```

Persistence: access token in memory only; refresh token in SecureStore (mobile) / httpOnly cookie (web)

## Account Store (accountStore.ts)

```typescript
interface AccountState {
  accounts: Account[]
  selectedAccountId: string | null
  isLoading: boolean
  error: string | null
}
// Computed
selectedAccount: Account | undefined  // derived from accounts + selectedAccountId
// Actions
fetchAccounts(): Promise<void>
selectAccount(accountId: string): void
refreshBalance(accountId: string): Promise<void>
```

## Transaction Store (transactionStore.ts)

```typescript
interface TransactionState {
  transactions: Transaction[]
  total: number
  page: number
  pageSize: number
  filters: TransactionFilters
  isLoading: boolean
}
// Actions
fetchTransactions(accountId: string, filters?: TransactionFilters): Promise<void>
nextPage(): void
prevPage(): void
setFilter(key: keyof TransactionFilters, value: unknown): void
clearFilters(): void
```

## Usage Pattern

```typescript
// Web — Next.js
'use client'
import { useAuthStore } from '@banxe/shared'
const { user, isAuthenticated, logout } = useAuthStore()

// Mobile — React Native
import { useAccountStore } from '@banxe/shared'
const { selectedAccount, fetchAccounts } = useAccountStore()
```

## Invariants

- Stores are initialised once in `@banxe/shared` — not per-package
- No store directly mutates server state — actions call API then update local state
- `isLoading` / `error` pattern on all async actions
- SCA challenge flow: `authStore.setChallenge()` → show SCAChallenge UI → `authStore.clearChallenge()` on resolve

*Last updated: 2026-04-13*
