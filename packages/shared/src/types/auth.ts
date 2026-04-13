/**
 * Auth types — matches banxe-emi-stack auth router
 */
import type { ISODateString } from './api.js'

export interface LoginRequest {
  email: string
  pin: string  // 6-digit PIN (not password — PSD2 SCA requirement)
}

export interface TokenResponse {
  access_token: string
  token_type: 'bearer'
  expires_in: number  // seconds
  refresh_token?: string
}

export interface AuthUser {
  id: string
  email: string
  full_name: string
  kyc_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EDD'
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEP' | 'BLOCKED'
  created_at: ISODateString
  last_login?: ISODateString
  mfa_enabled: boolean
}

export interface RefreshRequest {
  refresh_token: string
}

export interface LogoutRequest {
  token: string
}

/** PSD2 SCA second factor */
export interface SCAChallenge {
  challenge_id: string
  method: 'biometric' | 'otp' | 'push'
  expires_at: ISODateString
}

export interface SCAConfirmation {
  challenge_id: string
  response: string  // biometric result or OTP
}

// ── SCA API request/response types (S15-01/S15-02) ──────────────────────────

/** POST /v1/auth/sca/challenge request */
export interface SCAInitiateRequest {
  customer_id: string
  transaction_id: string
  method: 'otp' | 'biometric'
  amount?: string  // DecimalString — PSD2 RTS Art.10 dynamic linking
  payee?: string   // Payee name — PSD2 RTS Art.10 dynamic linking
}

/** POST /v1/auth/sca/challenge response */
export interface SCAInitiateResponse {
  challenge_id: string
  transaction_id: string
  method: 'otp' | 'biometric'
  expires_at: ISODateString
  message: string
}

/** POST /v1/auth/sca/verify request */
export interface SCAVerifyRequest {
  challenge_id: string
  otp_code?: string          // 6-digit TOTP (method=otp)
  biometric_proof?: string   // WebAuthn assertion (method=biometric)
}

/** POST /v1/auth/sca/verify response */
export interface SCAVerifyResponse {
  verified: boolean
  transaction_id: string
  sca_token?: string         // PSD2 RTS Art.10 JWT — include in payment Authorization
  error?: string
  attempts_remaining?: number
}

/** GET /v1/auth/sca/methods/{customer_id} response */
export interface SCAMethodsResponse {
  customer_id: string
  methods: string[]
  preferred: string
}
