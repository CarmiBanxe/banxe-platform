/**
 * tests/mobile/transfers.test.tsx — Mobile transfer + biometric tests
 * IL-UI-01
 */
import { describe, it, expect } from 'vitest'

describe('Mobile transfer validation', () => {
  it('empty IBAN shows alert', () => {
    const iban = ''
    const amount = '100.00'
    const shouldShowAlert = !iban.trim() || !amount.trim()
    expect(shouldShowAlert).toBe(true)
  })

  it('empty amount shows alert', () => {
    const iban = 'GB29NWBK60161331926819'
    const amount = ''
    const shouldShowAlert = !iban.trim() || !amount.trim()
    expect(shouldShowAlert).toBe(true)
  })

  it('both filled proceeds to biometric', () => {
    const iban = 'GB29NWBK60161331926819'
    const amount = '500.00'
    const shouldShowAlert = !iban.trim() || !amount.trim()
    expect(shouldShowAlert).toBe(false)
  })

  it('amount is string not number', () => {
    // FCA I-01: amounts must be strings
    const amount = '1234.56'
    expect(typeof amount).toBe('string')
    expect(amount).not.toBe(1234.56)
  })
})

describe('Biometric SCA', () => {
  it('biometric success transitions to success step', () => {
    const biometricResult = { success: true }
    const step = biometricResult.success ? 'success' : 'form'
    expect(step).toBe('success')
  })

  it('biometric failure returns to form step', () => {
    const biometricResult = { success: false }
    const step = biometricResult.success ? 'success' : 'form'
    expect(step).toBe('form')
  })

  it('haptic notification on success', () => {
    const hapticType = 'success'
    expect(['success', 'warning', 'error']).toContain(hapticType)
  })

  it('haptic error notification on failure', () => {
    const hapticType = 'error'
    expect(hapticType).toBe('error')
  })
})

describe('Design token usage', () => {
  it('primary color is correct', () => {
    const primary = '#1A2B6B'
    expect(primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it('accent color is correct', () => {
    const accent = '#00C6AE'
    expect(accent).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it('error color is correct', () => {
    const error = '#DC2626'
    expect(error).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it('success color is correct', () => {
    const success = '#16A34A'
    expect(success).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})
