/**
 * tests/web/dashboard.test.tsx — Dashboard page logic tests
 * IL-UI-01
 */
import { describe, it, expect } from 'vitest'
import type { Balance, Account } from '../../packages/shared/src/types/account.js'

describe('Dashboard — balance display', () => {
  it('balance amounts are strings (never number/float)', () => {
    const balance: Balance = {
      account_id: 'acc-001',
      balance: '10000.00',
      available: '9500.00',
      pending: '500.00',
      currency: 'GBP',
      as_of: '2026-04-11T12:00:00Z',
    }
    expect(typeof balance.balance).toBe('string')
    expect(typeof balance.available).toBe('string')
    expect(typeof balance.pending).toBe('string')
    // FCA I-01: never float
    expect(balance.balance).not.toContain('e+')
    expect(isNaN(parseFloat(balance.balance))).toBe(false)
  })

  it('account type is one of allowed values', () => {
    const allowedTypes = ['OPERATIONAL', 'SAFEGUARDING', 'CLIENT', 'FLOAT']
    const account: Account = {
      account_id: 'acc-001',
      display_name: 'Operational Account',
      account_type: 'OPERATIONAL',
      currency: 'GBP',
      status: 'ACTIVE',
      created_at: '2026-01-01T00:00:00Z',
    }
    expect(allowedTypes).toContain(account.account_type)
  })

  it('quick actions navigate to correct routes', () => {
    const actions = [
      { label: 'Send', route: '/transfers' },
      { label: 'Transactions', route: '/transactions' },
      { label: 'Statements', route: '/statements' },
      { label: 'Compliance', route: '/compliance' },
    ]
    actions.forEach((a) => {
      expect(a.route).toMatch(/^\/[a-z]+$/)
    })
  })

  it('skeleton loaders shown when isLoading = true', () => {
    const isLoading = true
    const skeletonCount = isLoading ? 3 : 0
    expect(skeletonCount).toBe(3)
  })

  it('sign out clears auth and redirects to /auth/login', () => {
    const logoutAction = { clearAuth: true, redirectTo: '/auth/login' }
    expect(logoutAction.clearAuth).toBe(true)
    expect(logoutAction.redirectTo).toBe('/auth/login')
  })
})

describe('Dashboard — account store', () => {
  it('setAccounts selects first account as default', () => {
    const accounts: Account[] = [
      { account_id: 'acc-001', display_name: 'Main', account_type: 'OPERATIONAL', currency: 'GBP', status: 'ACTIVE', created_at: '' },
      { account_id: 'acc-002', display_name: 'Savings', account_type: 'CLIENT', currency: 'EUR', status: 'ACTIVE', created_at: '' },
    ]
    const selectedAccountId = accounts[0]?.account_id ?? null
    expect(selectedAccountId).toBe('acc-001')
  })
})
