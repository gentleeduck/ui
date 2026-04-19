import { config } from '@gentleduck/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  alias: {
    '@duck-docs': './src',
  },
  entry: ['src/**/*.{ts,tsx}', '!src/**/__test__/**'],
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', /^node:/, /^@gentleduck\//],
  plugins: [],
})
