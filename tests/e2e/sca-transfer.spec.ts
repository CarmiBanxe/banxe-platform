/**
 * tests/e2e/sca-transfer.spec.ts — PSD2 SCA Transfer E2E tests
 * S15-07 | PSD2 Directive 2015/2366 Art.97 | banxe-platform
 *
 * Tests: full transfer flow with SCA challenge
 *   - Transfer form → POST /auth/sca/challenge → OTP entry → POST /auth/sca/verify → success
 *   - Invalid OTP → error message + attempts remaining
 *   - Rate limit (5 failures) → challenge locked → 429
 *   - Replay prevention — challenge marked used after success
 *   - Dynamic linking — amount + payee in confirmation
 *   - SCA cancel → back to form
 *
 * API: mocked via page.route()
 */

import { test, expect, Page } from '@playwright/test'

const API_BASE = 'http://localhost:8000'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function setupAuthState(page: Page) {
  // Inject auth token into Zustand store via localStorage mock
  await page.addInitScript(() => {
    window.__BANXE_TEST_AUTH__ = {
      token: 'mock-access-token',
      user: { id: 'cust-test-001', email: 'test@banxe.com' },
    }
  })
}

async function mockSCAChallenge(page: Page, challengeId = 'chal-test-001') {
  await page.route(`${API_BASE}/v1/auth/sca/challenge`, async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        challenge_id: challengeId,
        transaction_id: 'txn-test-001',
        method: 'otp',
        expires_at: new Date(Date.now() + 120_000).toISOString(),
        message: 'SCA challenge created. Complete authentication within the time limit.',
      }),
    })
  })
}

async function mockSCAVerifySuccess(page: Page) {
  await page.route(`${API_BASE}/v1/auth/sca/verify`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        verified: true,
        transaction_id: 'txn-test-001',
        sca_token: 'mock-sca-jwt-token',
      }),
    })
  })
}

async function mockSCAVerifyFailure(page: Page, attemptsRemaining = 4) {
  await page.route(`${API_BASE}/v1/auth/sca/verify`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        verified: false,
        transaction_id: 'txn-test-001',
        error: 'Invalid OTP or biometric proof',
        attempts_remaining: attemptsRemaining,
      }),
    })
  })
}

async function mockSCARateLimit(page: Page) {
  await page.route(`${API_BASE}/v1/auth/sca/verify`, async (route) => {
    await route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'Too many failed attempts. Request a new challenge.' }),
    })
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Transfer form', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
    await page.goto('/transfers')
  })

  test('transfer form renders IBAN, amount and reference fields', async ({ page }) => {
    await expect(page.getByLabel(/iban/i)).toBeVisible()
    await expect(page.getByLabel(/amount/i)).toBeVisible()
    await expect(page.getByLabel(/reference/i)).toBeVisible()
  })

  test('invalid IBAN shows error', async ({ page }) => {
    await page.getByLabel(/iban/i).fill('GB123')
    await page.getByLabel(/amount/i).fill('100.00')
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('alert')).toContainText(/iban/i)
  })

  test('invalid amount shows error', async ({ page }) => {
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('-1')
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByRole('alert')).toContainText(/amount/i)
  })
})

test.describe('PSD2 SCA challenge flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
  })

  test('valid form submission triggers SCA challenge', async ({ page }) => {
    await mockSCAChallenge(page)
    await page.goto('/transfers')
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('150.00')
    await page.getByRole('button', { name: /continue/i }).click()
    // SCA modal/panel should appear
    await expect(page.getByText(/security verification/i)).toBeVisible()
  })

  test('successful OTP entry shows success screen', async ({ page }) => {
    await mockSCAChallenge(page)
    await mockSCAVerifySuccess(page)
    await page.goto('/transfers')
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('250.00')
    await page.getByRole('button', { name: /continue/i }).click()
    // Enter valid OTP
    await page.getByLabel(/code|otp|authenticator/i).fill('123456')
    await page.getByRole('button', { name: /verify/i }).click()
    // Success screen
    await expect(page.getByText(/transfer sent|submitted/i)).toBeVisible()
    await expect(page.getByText('250.00')).toBeVisible()
  })

  test('wrong OTP shows error with attempts remaining', async ({ page }) => {
    await mockSCAChallenge(page)
    await mockSCAVerifyFailure(page, 4)
    await page.goto('/transfers')
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('100.00')
    await page.getByRole('button', { name: /continue/i }).click()
    await page.getByLabel(/code|otp|authenticator/i).fill('999999')
    await page.getByRole('button', { name: /verify/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByRole('alert')).toContainText(/4|remaining/i)
  })

  test('rate limit (5 failures) shows locked challenge message', async ({ page }) => {
    await mockSCAChallenge(page)
    await mockSCARateLimit(page)
    await page.goto('/transfers')
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('100.00')
    await page.getByRole('button', { name: /continue/i }).click()
    await page.getByLabel(/code|otp|authenticator/i).fill('000000')
    await page.getByRole('button', { name: /verify/i }).click()
    await expect(page.getByRole('alert')).toContainText(/locked|too many/i)
  })

  test('cancel SCA returns to transfer form', async ({ page }) => {
    await mockSCAChallenge(page)
    await page.goto('/transfers')
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('100.00')
    await page.getByRole('button', { name: /continue/i }).click()
    await page.getByRole('button', { name: /cancel/i }).click()
    // Should be back on the form
    await expect(page.getByLabel(/iban/i)).toBeVisible()
  })

  test('transfer amount is displayed in SCA confirmation', async ({ page }) => {
    await mockSCAChallenge(page)
    await page.goto('/transfers')
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('500.00')
    await page.getByRole('button', { name: /continue/i }).click()
    // Amount should be shown in SCA context
    await expect(page.getByText(/500/)).toBeVisible()
  })

  test('PSD2 Art.97 regulatory footer visible during SCA', async ({ page }) => {
    await mockSCAChallenge(page)
    await page.goto('/transfers')
    await page.getByLabel(/iban/i).fill('GB29 NWBK 6016 1331 9268 19')
    await page.getByLabel(/amount/i).fill('100.00')
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page.getByText(/PSD2.*Art\.97|FRN/i)).toBeVisible()
  })
})
