import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: 'playwright',
    },
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
