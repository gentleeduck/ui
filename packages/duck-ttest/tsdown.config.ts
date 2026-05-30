import { config } from '@gentleduck/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  // Exclude test files from the published dist — defence in depth alongside
  // the negated globs in `package.json#files`.
  entry: ['./src/**/*.ts', '!./src/**/*.test.ts', '!./src/**/*.spec.ts'],
})
