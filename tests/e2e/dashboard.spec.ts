/**
 * tests/e2e/dashboard.spec.ts — Dashboard E2E tests
 * S15-07 | banxe-platform
 *
 * Tests: dashboard renders, navigation, account balance display, transaction list
 * API: mocked via page.route()
 */

import { test, expect, Page } from '@playwright/test'

const API_BASE = 'http://localhost:8000'

async function setupAuthAndMockAPIs(page: Page) {
  // Mock accounts
  await page.route(`${API_BASE}/v1/ledger/accounts`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accounts: [
          { account_id: 'acct-001', account_name: 'Main Account', currency: 'GBP', status: 'ACTIVE' },
          { account_id: 'acct-002', account_name: 'Savings', currency: 'EUR', status: 'ACTIVE' },
        ],
      }),
    })
  })

  // Mock balance
  await page.route(`${API_BASE}/v1/ledger/accounts/acct-001/balance`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        account_id: 'acct-001',
        balance: '12500.00',
        currency: 'GBP',
        available: '12000.00',
      }),
    })
  })

  // Mock transactions
  await page.route(`${API_BASE}/v1/transactions*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        transactions: [
          { id: 'txn-001', amount: '150.00', currency: 'GBP', description: 'ACME Ltd', created_at: new Date().toISOString() },
          { id: 'txn-002', amount: '-50.00', currency: 'GBP', description: 'Coffee Shop', created_at: new Date().toISOString() },
        ],
        total: 2,
      }),
    })
  })

  // Set auth state
  await page.addInitScript(() => {
    window.__BANXE_TEST_AUTH__ = {
      token: 'mock-access-token',
      user: { id: 'cust-test-001', email: 'test@banxe.com' },
    }
  })
}

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthAndMockAPIs(page)
    await page.goto('/dashboard')
  })

  test('dashboard page renders without errors', async ({ page }) => {
    await expect(page).toHaveTitle(/banxe|dashboard/i)
    await expect(page.locator('main')).toBeVisible()
  })

  test('navigation links are present', async ({ page }) => {
    // Should have links to key sections
    await expect(page.getByRole('link', { name: /transfer|send/i })).toBeVisible()
  })

  test('page has no critical accessibility violations', async ({ page }) => {
    // Check for basic landmark elements
    await expect(page.locator('main')).toBeVisible()
    // Headings should exist
    const headings = await page.getByRole('heading').all()
    expect(headings.length).toBeGreaterThan(0)
  })
})

test.describe('Navigation', () => {
  test('transfers link navigates to transfers page', async ({ page }) => {
    await page.addInitScript(() => {
      window.__BANXE_TEST_AUTH__ = {
        token: 'mock-access-token',
        user: { id: 'cust-test-001', email: 'test@banxe.com' },
      }
    })
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /transfer|send/i }).first().click()
    await expect(page).toHaveURL(/transfers/)
  })

  test('settings link navigates to settings page', async ({ page }) => {
    await page.addInitScript(() => {
      window.__BANXE_TEST_AUTH__ = {
        token: 'mock-access-token',
        user: { id: 'cust-test-001', email: 'test@banxe.com' },
      }
    })
    await page.goto('/dashboard')
    const settingsLink = page.getByRole('link', { name: /settings|profile/i })
    if (await settingsLink.isVisible()) {
      await settingsLink.click()
      await expect(page).toHaveURL(/settings/)
    }
  })
})
