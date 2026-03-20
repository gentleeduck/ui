import { config } from '@gentleduck/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  entry: ['src/**/*.{ts,tsx}', '!src/**/__test__/**', '!src/**/adapter-test-suite.ts'],
})
