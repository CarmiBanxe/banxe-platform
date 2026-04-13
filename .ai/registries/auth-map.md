# Auth Map — Authentication & Session Flows
# banxe-platform | PSD2 Art.97 | OAuth 2.0 / PKCE

## Files

| Package | File | Purpose |
|---------|------|---------|
| web | `packages/web/src/app/auth/login/page.tsx` | Login page (Next.js App Router) |
| web | `packages/web/src/components/layout/AuthGuard.tsx` | Route protection HOC |
| web | `packages/web/src/components/molecules/SCAChallenge.tsx` | SCA modal (see sca-map.md) |
| mobile | `packages/mobile/app/auth/onboarding.tsx` | Onboarding / first-run screen |
| mobile | `packages/mobile/app/_layout.tsx` | Root layout with auth gate |
| mobile | `packages/mobile/app/sca/index.tsx` | SCA modal screen (see sca-map.md) |
| shared | `packages/shared/src/types/auth.ts` | Auth type definitions |
| shared | `packages/shared/src/store/authStore.ts` | Zustand auth state |
| shared | `packages/shared/src/api-client.ts` | `authApi` — login, refresh, logout |

## Auth Types (packages/shared/src/types/auth.ts)

| Type | Fields | Notes |
|------|--------|-------|
| `LoginRequest` | `email`, `password` | Standard credential login |
| `TokenResponse` | `access_token`, `refresh_token`, `expires_in`, `token_type` | JWT Bearer |
| `AuthUser` | `user_id`, `email`, `roles`, `kyc_status`, `sca_enrolled` | Current session user |
| `SCAChallenge` | `challenge_id`, `method`, `expires_at` | Active SCA challenge |
| `SCAConfirmation` | `challenge_id`, `response` | OTP or biometric response |

## Auth Store (authStore.ts)

```typescript
// State
interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  pendingChallenge: SCAChallenge | null
}
// Actions: login(), logout(), setChallenge(), clearChallenge(), refreshToken()
```

## Login Flow (PSD2-compliant)

```
User enters email+password
  → POST /auth/login
  → 200 + TokenResponse (no SCA required — trusted device)
  → 202 + SCAChallenge (new device / payment > £30)
      → Show SCAChallenge modal
      → POST /auth/sca { challenge_id, response }
      → 200 + TokenResponse
  → Store tokens → redirect to /dashboard
```

## Session Management

- Access token lifetime: 15 min (RTS Art.10)
- Refresh token lifetime: 7 days
- Silent refresh: `authApi.refreshToken()` at T-2 min
- Inactivity lock: 5 min (PSD2 RTS Art.11) → show SCA prompt

## Route Protection

- Web: `AuthGuard` wraps all protected routes, checks `isAuthenticated` from store
- Mobile: Root `_layout.tsx` gates stack navigation based on auth state
- KYC gate: Some routes additionally require `kyc_status === 'APPROVED'`

*Last updated: 2026-04-13*
