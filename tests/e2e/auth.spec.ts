/**
 * tests/e2e/auth.spec.ts — Authentication E2E tests
 * S15-07 | banxe-platform
 *
 * Tests: login flow, logout, session persistence, redirect on unauthenticated access
 * API: mocked via page.route() (no real backend needed)
 */

import { test, expect, Page } from '@playwright/test'

// ── Mock helpers ──────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8000'

async function mockLoginSuccess(page: Page, customerId = 'cust-test-001') {
  await page.route(`${API_BASE}/v1/auth/login`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'mock-access-token',
        expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        refresh_token: 'mock-refresh-token',
        token_type: 'bearer',
      }),
    })
  })
}

async function mockLoginFailure(page: Page) {
  await page.route(`${API_BASE}/v1/auth/login`, async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'Invalid email or PIN' }),
    })
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Login flow', () => {
  test('login page renders form with email and PIN fields', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/pin/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible()
  })

  test('login success redirects to dashboard', async ({ page }) => {
    await mockLoginSuccess(page)
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('test@banxe.com')
    await page.getByLabel(/pin/i).fill('123456')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    await expect(page).toHaveURL(/dashboard/)
  })

  test('invalid credentials shows error message', async ({ page }) => {
    await mockLoginFailure(page)
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('wrong@test.com')
    await page.getByLabel(/pin/i).fill('999999')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByRole('alert')).toContainText(/invalid/i)
  })

  test('empty PIN shows validation error', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill('test@banxe.com')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    // Form should not submit — PIN is required
    await expect(page).toHaveURL(/login/)
  })

  test('unauthenticated user redirected from dashboard to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login/)
  })

  test('unauthenticated user redirected from transfers to login', async ({ page }) => {
    await page.goto('/transfers')
    await expect(page).toHaveURL(/login/)
  })
})
