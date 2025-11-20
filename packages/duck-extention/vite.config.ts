import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'

import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
  },
  plugins: [
    tailwindcss(),
    webExtension({
      manifest: 'manifest.json',
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
