import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/**/*.{test,spec}.{ts,tsx}',
      'packages/*/src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    reporter: ['verbose'],
  },
  resolve: {
    alias: {
      '@banxe/shared': new URL('./packages/shared/src/index.ts', import.meta.url).pathname,
    },
  },
})
