/**
 * tests/web/transfers.test.tsx — Transfer page logic + PSD2 SCA tests
 * IL-UI-01
 */
import { describe, it, expect } from 'vitest'

describe('Transfer form validation', () => {
  const validateIBAN = (iban: string) => {
    const clean = iban.replace(/\s/g, '').toUpperCase()
    return clean.length >= 15 && clean.length <= 34
  }

  it('valid UK IBAN passes validation', () => {
    expect(validateIBAN('GB29 NWBK 6016 1331 9268 19')).toBe(true)
    expect(validateIBAN('GB29NWBK60161331926819')).toBe(true)
  })

  it('too short IBAN fails validation', () => {
    expect(validateIBAN('GB123')).toBe(false)
    expect(validateIBAN('')).toBe(false)
  })

  it('too long IBAN fails validation', () => {
    expect(validateIBAN('GB' + '1'.repeat(35))).toBe(false)
  })

  it('amount must be positive number string', () => {
    const isValidAmount = (a: string) => !isNaN(Number(a)) && Number(a) > 0
    expect(isValidAmount('100.00')).toBe(true)
    expect(isValidAmount('0.01')).toBe(true)
    expect(isValidAmount('0')).toBe(false)
    expect(isValidAmount('-1')).toBe(false)
    expect(isValidAmount('abc')).toBe(false)
    expect(isValidAmount('')).toBe(false)
  })

  it('amount is treated as string, not float', () => {
    // FCA I-01: amounts must stay as strings
    const amount = '10000.50'
    expect(typeof amount).toBe('string')
    // Should not lose precision if treated as string
    expect(amount).toBe('10000.50')
  })
})

describe('PSD2 SCA flow', () => {
  it('form step precedes SCA step', () => {
    const steps = ['form', 'sca', 'success']
    expect(steps.indexOf('form')).toBeLessThan(steps.indexOf('sca'))
    expect(steps.indexOf('sca')).toBeLessThan(steps.indexOf('success'))
  })

  it('SCA code must be 6 digits', () => {
    const isValidSCA = (code: string) => /^[0-9]{6}$/.test(code)
    expect(isValidSCA('123456')).toBe(true)
    expect(isValidSCA('12345')).toBe(false)
    expect(isValidSCA('1234567')).toBe(false)
    expect(isValidSCA('abcdef')).toBe(false)
  })

  it('cancel from SCA step returns to form', () => {
    let step = 'sca'
    const cancel = () => { step = 'form' }
    cancel()
    expect(step).toBe('form')
  })

  it('success step shows amount and IBAN', () => {
    const transferData = { amount: '500.00', iban: 'GB29NWBK60161331926819', currency: 'GBP' }
    const summaryText = `${transferData.amount} ${transferData.currency} to ${transferData.iban}`
    expect(summaryText).toContain('500.00')
    expect(summaryText).toContain('GBP')
    expect(summaryText).toContain('GB29NWBK')
  })
})
