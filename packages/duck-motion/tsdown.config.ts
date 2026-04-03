import { config } from '@gentleduck/tsdown-config'

import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  entry: ['src/**/*.{ts,tsx,css}', '!src/**/__test__/**'],
  external: [...(Array.isArray(config.external) ? config.external : []), 'motion', 'motion/react'],
})
