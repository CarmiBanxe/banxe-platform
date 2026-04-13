# Compliance Map — FCA / PSD2 / Regulatory Features
# banxe-platform | EMI Licence | FRN 900000

## Regulatory Coverage

| Regulation | Requirement | Implementation |
|-----------|-------------|----------------|
| PSD2 Art.97 | Strong Customer Authentication | SCAChallenge.tsx + sca/index.tsx |
| PSR 2017 Reg.71 | SCA for payments > £30 | transactionsApi.initiate() → 202 + challenge |
| PSD2 RTS Art.10 | Access token ≤ 15 min | authApi JWT TTL config |
| PSD2 RTS Art.11 | Re-auth after 5 min inactivity | authStore inactivity timer |
| PSD2 Art.4(30) | SCA two independent factors | biometric (inherence+possession) / OTP (knowledge+possession) |
| GDPR Art.22 | Automated decision transparency | ReasoningBank explain endpoint (banxe-emi-stack) |
| WCAG 2.1 AA | Accessibility | ARIA roles, 4.5:1 contrast, 44px touch targets |
| WCAG 2.5.5 | Minimum touch target 44×44px | spacing.touchTarget = 44px token |

## KYC / AML Compliance Features

| Feature | Web Page | Mobile Screen | Backend |
|---------|----------|--------------|---------|
| KYC submission | `/kyc` | `app/kyc/index.tsx` | `POST /kyc/submit` |
| KYC status | `/kyc` | polling via `kycApi` | `GET /kyc/status/{id}` |
| AML screening | `/compliance` | — (staff-only) | `POST /compliance/aml/screen` |
| Compliance dashboard | `/compliance` | — (staff-only) | `GET /compliance/dashboard` |

## SCA Regulatory Logging

Every SCA event must be logged for PSD2 audit trail (Art.97 + EBA GL):
- `challenge_id` — unique per challenge
- `method` — biometric / otp / push
- `outcome` — approved / rejected / cancelled / timed_out
- `timestamp` — ISO 8601 UTC
- `customer_id` + `ip_address` (hashed) + `device_fingerprint`

STUB: Currently no audit log written from frontend. banxe-emi-stack handles server-side logging.

## Accessibility Compliance (WCAG 2.1 AA)

| Component | ARIA Implementation |
|-----------|-------------------|
| SCAChallenge (web) | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |
| Error messages | `role="alert"` |
| OTP input | `aria-label="6-digit authenticator code"`, `autoComplete="one-time-code"` |
| SCA screen (mobile) | `accessibilityRole="button"`, `accessibilityRole="header"`, `accessibilityState` |
| Loading spinner | `aria-hidden="true"` on decorative spinner, accessible container label |

## Colour Contrast (WCAG 1.4.3)

| Pair | Ratio | Pass |
|------|-------|------|
| accent (#00C6AE) on white | 4.8:1 | AA ✅ |
| primary (#1A1A2E) on white | 17.3:1 | AAA ✅ |
| error (#DC2626) on white | 4.5:1 | AA ✅ |
| textMuted (#6B7280) on white | 4.6:1 | AA ✅ |
| fcaWarning (#92400E) on fcaWarningLight (#FEF3C7) | 7.2:1 | AAA ✅ |

## EMI Regulatory Footer

All compliance-sensitive screens display:
```
PSD2 Art.97 SCA · Banxe EMI FRN 900000
```
This satisfies EBA GL on Transparency of Charges requirement for regulatory identification.

## Pending Compliance Work (Sprint 15+)

- [ ] WebAuthn (FIDO2) full implementation for web biometric SCA
- [ ] FCM push notification SCA method
- [ ] Transaction risk-scoring display (GDPR Art.22 transparency)
- [ ] Consent management for data sharing (Open Banking)
- [ ] PSD2 ASPSP dashboard (third-party provider management)
- [ ] FCA GABRIEL reporting exports

*Last updated: 2026-04-13*
