/**
 * playwright.config.ts — Playwright E2E test configuration
 * S15-07 | banxe-platform
 *
 * Tests: tests/e2e/*.spec.ts
 * Target: Next.js web app (packages/web)
 * API mocking: page.route() — no real backend needed
 *
 * Run: npx playwright test
 * Run single: npx playwright test tests/e2e/sca.spec.ts
 * Debug: npx playwright test --debug
 */

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  webServer: {
    command: 'cd packages/web && npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
