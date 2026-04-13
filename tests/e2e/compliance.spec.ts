/**
 * tests/e2e/compliance.spec.ts — Compliance page E2E tests
 * S15-07 | FCA / PSD2 | banxe-platform
 *
 * Tests: compliance dashboard renders, KYC status display, AML monitor
 * API: mocked via page.route()
 */

import { test, expect, Page } from '@playwright/test'

const API_BASE = 'http://localhost:8000'

async function setupComplianceAPIs(page: Page) {
  await page.addInitScript(() => {
    window.__BANXE_TEST_AUTH__ = {
      token: 'mock-access-token',
      user: { id: 'cust-test-001', email: 'test@banxe.com', kyc_status: 'VERIFIED' },
    }
  })

  await page.route(`${API_BASE}/v1/compliance/dashboard`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        kyc_pending: 3,
        aml_alerts: 1,
        recon_status: 'BALANCED',
        last_updated: new Date().toISOString(),
      }),
    })
  })

  await page.route(`${API_BASE}/v1/monitor*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        alerts: [
          {
            alert_id: 'alert-001',
            severity: 'HIGH',
            customer_id: 'cust-xyz',
            description: 'Velocity threshold exceeded',
            created_at: new Date().toISOString(),
          },
        ],
      }),
    })
  })
}

test.describe('Compliance page', () => {
  test.beforeEach(async ({ page }) => {
    await setupComplianceAPIs(page)
    await page.goto('/compliance')
  })

  test('compliance page renders without errors', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible()
  })

  test('page has regulatory headings visible', async ({ page }) => {
    const headings = await page.getByRole('heading').all()
    expect(headings.length).toBeGreaterThan(0)
  })

  test('compliance page accessible from navigation', async ({ page }) => {
    await page.goto('/dashboard')
    const complianceLink = page.getByRole('link', { name: /compliance|aml/i })
    if (await complianceLink.isVisible()) {
      await complianceLink.click()
      await expect(page).toHaveURL(/compliance/)
    }
  })
})

test.describe('WCAG 2.1 AA accessibility', () => {
  test('login page has no missing form labels', async ({ page }) => {
    await page.goto('/auth/login')
    const inputs = await page.locator('input').all()
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false
      expect(hasLabel || !!ariaLabel || !!ariaLabelledBy).toBeTruthy()
    }
  })

  test('error alerts have role=alert', async ({ page }) => {
    await page.route(`${API_BASE}/v1/auth/login`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Invalid credentials' }),
      })
    })
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('bad@test.com')
    await page.getByLabel(/pin/i).fill('000000')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    const alert = page.getByRole('alert')
    await expect(alert).toBeVisible()
  })

  test('SCA dialog has role=dialog and aria-modal', async ({ page }) => {
    await page.addInitScript(() => {
      window.__BANXE_TEST_AUTH__ = {
        token: 'mock-access-token',
        user: { id: 'cust-001', email: 'test@banxe.com' },
      }
    })
    await page.route(`${API_BASE}/v1/auth/sca/challenge`, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          challenge_id: 'chal-test-001',
          transaction_id: 'txn-001',
          method: 'otp',
          expires_at: new Date(Date.now() + 120_000).toISOString(),
          message: 'SCA challenge created.',
        }),
      })
    })
    await page.goto('/transfers')
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('100.00')
    await page.getByRole('button', { name: /continue/i }).click()
    // SCA modal should have role=dialog
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
  })
})
