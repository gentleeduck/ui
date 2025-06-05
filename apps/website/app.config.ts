import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import { cloudflare } from 'unenv'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { compression } from 'vite-plugin-compression2'
import imagemin from 'unplugin-imagemin/vite'
import contentCollections from '@content-collections/vinxi'

export default defineConfig({
  vite: {
    plugins: [
      contentCollections(),
      svgr(),
      tailwindcss(),
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      imagemin(),
      compression({
        algorithm: 'brotliCompress',
      }),
    ],
  },
  server: {
    preset: 'cloudflare-pages',
    unenv: cloudflare,
  },
})
