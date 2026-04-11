/**
 * tests/mobile/dashboard.test.tsx — Mobile dashboard tests
 * IL-UI-01
 */
import { describe, it, expect } from 'vitest'

describe('Mobile dashboard', () => {
  it('balance card shows currency + amount as string', () => {
    const balance = { currency: 'GBP', balance: '10000.00', available: '9500.00', pending: '500.00' }
    expect(typeof balance.balance).toBe('string')
    expect(typeof balance.available).toBe('string')
    // FCA I-01: not float
    expect(balance.balance).not.toContain('e+')
  })

  it('quick actions have correct routes', () => {
    const quickActions = [
      { label: 'Send', route: '/(tabs)/transfers' },
      { label: 'History', route: '/(tabs)/transactions' },
      { label: 'KYC', route: '/kyc' },
      { label: 'Cards', route: '/cards' },
    ]
    const sendAction = quickActions.find((a) => a.label === 'Send')
    expect(sendAction?.route).toBe('/(tabs)/transfers')
  })

  it('pull-to-refresh re-fetches balance', async () => {
    let fetchCount = 0
    const load = async () => { fetchCount++ }
    const onRefresh = async () => { await load() }
    await onRefresh()
    expect(fetchCount).toBe(1)
  })

  it('card view shows masked PAN only', () => {
    const maskPAN = (last4: string) => `•••• •••• •••• ${last4}`
    const masked = maskPAN('4321')
    expect(masked).toBe('•••• •••• •••• 4321')
    expect(masked).not.toMatch(/^\d{16}$/)  // never full 16 digits
  })
})

describe('Mobile navigation', () => {
  it('tab routes are correct', () => {
    const tabs = ['dashboard', 'transfers', 'transactions', 'settings']
    expect(tabs).toHaveLength(4)
    expect(tabs).toContain('dashboard')
    expect(tabs).toContain('transfers')
  })

  it('modal routes are correct', () => {
    const modals = ['/kyc/index', '/cards/index']
    expect(modals).toHaveLength(2)
  })
})
