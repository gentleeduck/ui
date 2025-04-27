import { config } from '@gentelduck/tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...config,
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '^node:\*$'],
})
