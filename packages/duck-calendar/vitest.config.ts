import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    typecheck: {
      enabled: true,
      include: ['src/**/*.test-d.ts'],
    },
  },
})
