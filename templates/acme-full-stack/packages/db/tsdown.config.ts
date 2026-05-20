import { config } from '@acme/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  entry: ['src/index.ts', 'src/schema.ts', 'src/client.ts'],
  platform: 'node',
  plugins: [],
  external: ['drizzle-orm', 'postgres'],
})
