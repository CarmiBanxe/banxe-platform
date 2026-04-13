# Integration Map — banxe-platform ↔ banxe-emi-stack
# Frontend ↔ Backend API Contract | S14-10

## Overview

banxe-platform (Next.js + Expo) consumes banxe-emi-stack (FastAPI) REST API.
Backend: `/opt/banxe` + `/home/mmber/banxe-emi-stack`
API base: `http://localhost:8000` (dev)

## Endpoint Mapping

| Frontend call | Backend router | File |
|--------------|----------------|------|
| `POST /auth/login` | `auth_router` | `api/routers/auth.py` |
| `POST /auth/sca` | `auth_router` | `api/routers/auth.py` |
| `POST /auth/refresh` | `auth_router` | `api/routers/auth.py` |
| `GET /accounts` | `accounts_router` | `api/routers/accounts.py` |
| `GET /transactions` | `transactions_router` | `api/routers/transactions.py` |
| `POST /transactions/initiate` | `transactions_router` | `api/routers/transactions.py` |
| `POST /kyc/submit` | `kyc_router` | `api/routers/kyc.py` |
| `GET /kyc/status/{id}` | `kyc_router` | `api/routers/kyc.py` |
| `POST /compliance/aml/screen` | `compliance_router` | `api/routers/compliance.py` |
| `GET /compliance/dashboard` | `compliance_router` | `api/routers/compliance.py` |
| `GET /health/ready` | `health_router` | `api/routers/health.py` |

## Auth Integration

- JWT tokens from `POST /auth/login` → stored in authStore
- SCA challenge: backend returns HTTP 202 + `{ challenge_id, method, expires_at }`
- Frontend shows SCAChallenge modal → submits `POST /auth/sca { challenge_id, response }`
- Access token TTL: 15 min (PSD2 RTS Art.10)
- TOTP: banxe-emi-stack `services/two_factor/totp_service.py` (pyotp, SHA1, 6-digit, 30s)

## KYC Integration

KYC status gates the frontend:
- `PENDING` → KYC prompt shown, most features locked
- `DOCUMENT_REVIEW` / `MLRO_REVIEW` → read-only, pending banner
- `APPROVED` → full access
- `REJECTED` → error state, contact support

Frontend `KYCStatusResponse.status` maps to banxe-emi-stack `KYCStatus` enum.

## Payment SCA Trigger

```
Frontend: transactionsApi.initiate({ amount: "150.00", ... })
Backend: amount > 3000 (pence) → generate SCA challenge → HTTP 202
Frontend: detect 202 + SCAChallenge → show modal → confirm
Frontend: transactionsApi.confirmSCA({ challenge_id, response })
Backend: validate TOTP / biometric → complete transaction
```

## CORS Configuration (banxe-emi-stack)

Allowed origins (dev): `http://localhost:3000` (web), Expo dev client
Production: `https://banxe.com`, `https://app.banxe.com`

## Environment Variables

| Variable | Used In | Value (dev) |
|----------|---------|------------|
| `NEXT_PUBLIC_API_URL` | web | `http://localhost:8000` |
| `EXPO_PUBLIC_API_URL` | mobile | `http://localhost:8000` |
| `DATABASE_URL` | emi-stack | `postgresql://...` |
| `SECRET_KEY` | emi-stack | (secret) |
| `TOTP_SECRET_KEY` | emi-stack | (secret) |

## Sprint 14 Integration Status

| Feature | Status |
|---------|--------|
| Auth login/refresh | ✅ Implemented |
| SCA OTP flow | ✅ Stub (wire-up Sprint 15) |
| SCA Biometric web | 🔶 Stub — WebAuthn not implemented |
| SCA Biometric mobile | 🔶 Stub — biometric proof not POSTed |
| KYC submission | ✅ Implemented |
| Payment initiation | ✅ Implemented |
| Compliance dashboard | ✅ Implemented |

*Last updated: 2026-04-13*
