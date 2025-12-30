import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import '@testing-library/jest-dom'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), 'src')

export default defineConfig({
  resolve: {
    alias: {
      '@duck-docs': rootDir,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
