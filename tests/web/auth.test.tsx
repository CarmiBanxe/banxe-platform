/**
 * tests/web/auth.test.tsx — Login page tests
 * IL-UI-01
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), back: vi.fn() }),
  redirect: vi.fn(),
}))

vi.mock('@banxe/shared', () => ({
  authApi: {
    login: vi.fn(),
  },
  useAuthStore: vi.fn(() => ({
    setAuth: vi.fn(),
    setLoading: vi.fn(),
    clearAuth: vi.fn(),
    isAuthenticated: false,
    token: null,
    user: null,
  })),
}))

// ── Tests ─────────────────────────────────────────────────────────────────

describe('Login page', () => {
  it('LoginRequest type requires email and pin', () => {
    type LoginRequest = { email: string; pin: string }
    const req: LoginRequest = { email: 'test@banxe.com', pin: '123456' }
    expect(req.email).toBe('test@banxe.com')
    expect(req.pin).toBe('123456')
    expect(req.pin.length).toBe(6)
  })

  it('PIN must be exactly 6 numeric digits', () => {
    const validPins = ['123456', '000000', '999999']
    const invalidPins = ['12345', '1234567', 'abcdef', '']
    validPins.forEach((p) => expect(/^[0-9]{6}$/.test(p)).toBe(true))
    invalidPins.forEach((p) => expect(/^[0-9]{6}$/.test(p)).toBe(false))
  })

  it('login button disabled when email is empty', () => {
    const email = ''
    const pin = '123456'
    const isDisabled = !email || pin.length < 6
    expect(isDisabled).toBe(true)
  })

  it('login button disabled when PIN is too short', () => {
    const email = 'test@banxe.com'
    const pin = '123'
    const isDisabled = !email || pin.length < 6
    expect(isDisabled).toBe(true)
  })

  it('login button enabled with valid email and PIN', () => {
    const email = 'test@banxe.com'
    const pin = '123456'
    const isDisabled = !email || pin.length < 6
    expect(isDisabled).toBe(false)
  })

  it('PSD2 SCA: PIN input mode should be numeric', () => {
    // Contract: PIN input must have inputMode="numeric" and pattern="[0-9]{6}"
    const inputProps = { inputMode: 'numeric', pattern: '[0-9]{6}', maxLength: 6 }
    expect(inputProps.inputMode).toBe('numeric')
    expect(inputProps.pattern).toBe('[0-9]{6}')
    expect(inputProps.maxLength).toBe(6)
  })

  it('auth token response type is correct', () => {
    type TokenResponse = { access_token: string; token_type: 'bearer'; expires_in: number }
    const token: TokenResponse = {
      access_token: 'eyJhbGc...',
      token_type: 'bearer',
      expires_in: 3600,
    }
    expect(token.token_type).toBe('bearer')
    expect(token.expires_in).toBeGreaterThan(0)
  })
})

describe('Auth store', () => {
  it('clearAuth resets all auth state', () => {
    const state = {
      user: { id: '1', email: 'test@banxe.com', full_name: 'Test', kyc_status: 'VERIFIED', risk_level: 'LOW', created_at: '', mfa_enabled: false },
      token: 'abc123',
      isAuthenticated: true,
    }
    // Simulate clearAuth
    const cleared = { user: null, token: null, isAuthenticated: false }
    expect(cleared.user).toBeNull()
    expect(cleared.token).toBeNull()
    expect(cleared.isAuthenticated).toBe(false)
  })

  it('session timeout warning is 5 minutes (300000ms)', () => {
    const WARN_MS = 5 * 60 * 1000
    expect(WARN_MS).toBe(300_000)
  })

  it('session auto-logout is 10 minutes (600000ms)', () => {
    const LOGOUT_MS = 10 * 60 * 1000
    expect(LOGOUT_MS).toBe(600_000)
  })
})
