# API Map — Frontend API Client
# packages/shared/src/api-client.ts | IL-UI-01

## API Client Groups

| Export | Base Path | Methods |
|--------|-----------|---------|
| `authApi` | `/auth` | `login`, `logout`, `refreshToken`, `confirmSCA` |
| `accountsApi` | `/accounts` | `list`, `get`, `getBalance`, `getStatement` |
| `transactionsApi` | `/transactions` | `list`, `get`, `initiate`, `getStatus` |
| `kycApi` | `/kyc` | `submit`, `getStatus`, `uploadDocument` |
| `complianceApi` | `/compliance` | `getAMLScreening`, `getDashboard`, `getReconReport` |

## Auth API (authApi)

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `login(req)` | `POST /auth/login` | `LoginRequest` | `ApiResult<TokenResponse \| SCAChallenge>` |
| `logout()` | `POST /auth/logout` | — | `ApiResult<void>` |
| `refreshToken(token)` | `POST /auth/refresh` | `{ refresh_token }` | `ApiResult<TokenResponse>` |
| `confirmSCA(conf)` | `POST /auth/sca` | `SCAConfirmation` | `ApiResult<TokenResponse>` |

## Accounts API (accountsApi)

| Method | Endpoint | Response |
|--------|----------|---------|
| `list()` | `GET /accounts` | `ApiResult<Account[]>` |
| `get(id)` | `GET /accounts/{id}` | `ApiResult<Account>` |
| `getBalance(id)` | `GET /accounts/{id}/balance` | `ApiResult<Balance>` |
| `getStatement(id, period)` | `GET /accounts/{id}/statement?period=` | `ApiResult<Statement>` |

## Transactions API (transactionsApi)

| Method | Endpoint | Response |
|--------|----------|---------|
| `list(accountId, filters)` | `GET /transactions` | `ApiResult<PaginatedResponse<Transaction>>` |
| `get(txId)` | `GET /transactions/{id}` | `ApiResult<Transaction>` |
| `initiate(req)` | `POST /transactions/initiate` | `ApiResult<Transaction \| SCAChallenge>` |
| `getStatus(txId)` | `GET /transactions/{id}/status` | `ApiResult<{ status: string }>` |

## Error Handling Pattern

```typescript
const result = await authApi.login({ email, password })
if (!result.ok) {
  // result.error: ApiError = { code, message, details? }
  handleError(result.error)
  return
}
// result.data: TokenResponse
setToken(result.data.access_token)
```

## Base URL Configuration

| Environment | Base URL |
|-------------|---------|
| Development | `http://localhost:8000` |
| Staging | `https://api-staging.banxe.com` |
| Production | `https://api.banxe.com` |

Set via `NEXT_PUBLIC_API_URL` (web) / `EXPO_PUBLIC_API_URL` (mobile).

## Interceptors

- **Request**: Attach `Authorization: Bearer {accessToken}` from authStore
- **Response 401**: Trigger silent token refresh → retry once → logout on second 401
- **Response 202 + SCAChallenge**: Signal authStore to display SCA modal

*Last updated: 2026-04-13*
