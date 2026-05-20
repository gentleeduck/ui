import { config } from '@acme/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  entry: ['src/*/index.ts', 'src/*/index.tsx'],
})
