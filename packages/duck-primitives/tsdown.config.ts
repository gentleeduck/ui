import { config } from '@gentleduck/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  entry: ['./src/**', '!./src/**/__test__/**'],
  plugins: [],
})
