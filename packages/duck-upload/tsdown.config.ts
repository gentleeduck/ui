import { config } from '@gentleduck/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  entry: ['./src/index.ts', './src/core/index.ts', './src/react/index.ts', './src/strategies/index.ts'],
})
