import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import { cloudflare } from 'unenv'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
  server: {
    preset: 'cloudflare-pages',
    unenv: cloudflare,
  },
})
