import { config } from '@gentleduck/tsdown-config'

import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  entry: ['src/**/*.{ts,tsx}', '!src/**/__test__/**'],
  external: [
    ...(Array.isArray((config as { external?: string[] }).external)
      ? (config as { external?: string[] }).external!
      : []),
    'motion',
    'motion/react',
  ],
})
