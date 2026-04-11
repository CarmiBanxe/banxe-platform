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
