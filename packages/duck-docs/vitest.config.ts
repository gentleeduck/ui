import { defineConfig } from 'vitest/config'
import '@testing-library/jest-dom'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
