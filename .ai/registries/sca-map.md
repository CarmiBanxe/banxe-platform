# SCA Map — PSD2 Strong Customer Authentication
# S14-08 | PSD2 Directive 2015/2366 Art.97 | PSR 2017 Reg.71

## Components

| Package | File | Type | Status |
|---------|------|------|--------|
| web | `packages/web/src/components/molecules/SCAChallenge.tsx` | React modal | STUB |
| mobile | `packages/mobile/app/sca/index.tsx` | Expo Router screen | STUB |
| shared | `packages/shared/src/types/auth.ts` | `SCAChallenge`, `SCAConfirmation` types | STUB |

## SCA Triggers (PSD2 Art.97)

| Trigger | Threshold | Regulation |
|---------|-----------|------------|
| Payment | > £30 | PSR 2017 Reg.71 |
| New device login | Any session | PSD2 Art.97(1)(a) |
| Sensitive profile change | email, phone, beneficiary | PSD2 Art.97(1)(b) |
| Inactivity timeout | > 5 min session | RTS Art.11 |

## SCA Methods (PSD2 Art.4(30))

| Method | Web Implementation | Mobile Implementation | Factors |
|--------|-------------------|----------------------|---------|
| `biometric` | WebAuthn / FIDO2 (STUB) | expo-local-authentication (Face ID / Touch ID) | Possession + Inherence |
| `otp` | TOTP via Authenticator App | TOTP via Authenticator App | Knowledge + Possession |
| `push` | FCM in-app notification | FCM push (future) | Possession |

## Web Component — SCAChallenge.tsx

```typescript
interface SCAProps {
  challenge: SCAChallenge     // { challenge_id, method, expires_at }
  onConfirm: (c: SCAConfirmation) => Promise<void>
  onCancel: () => void
  paymentAmount?: string       // e.g. "£150.00" for PSR 2017 context
}
```

States: `prompt` → `otp_entry` | `submitting` → (success via onConfirm) | `error`

Accessibility: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="sca-title"`, `role="alert"` on errors

## Mobile Screen — packages/mobile/app/sca/index.tsx

Navigation params (via `useLocalSearchParams`):
- `challenge_id: string`
- `method: 'biometric' | 'otp' | 'push'`
- `expires_at: string`
- `payment_amount?: string`

On success: `router.back()` with `{ scaApproved: 'true', challengeId }`
On failure: `router.back()` with `{ scaApproved: 'false' }`

## Backend Integration (banxe-emi-stack)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /auth/sca` | POST | Submit SCA response `{ challenge_id, response }` |
| `GET /auth/sca/{challenge_id}` | GET | Poll challenge status |

STUB: OTP flow simulates 800ms delay. Biometric sends placeholder response.
Wire-up required: `authApi.confirmSCA()` in `packages/shared/src/api-client.ts`

## Stubs to Remove (Sprint 15+)

- [ ] Web biometric: replace `'biometric:stub:approved'` with real `navigator.credentials.get()` WebAuthn call
- [ ] Mobile biometric: POST biometric proof to `/auth/sca` after `LocalAuthentication.authenticateAsync()` success
- [ ] `router.setParams({ scaApproved: 'true' })` — currently commented out, wire after backend ready

*Last updated: 2026-04-13*
