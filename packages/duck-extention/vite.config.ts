import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'

import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    emptyOutDir: true,
    minify: 'esbuild',
    outDir: 'dist',
    rollupOptions: {
      output: {},
    },
    sourcemap: false,
    target: 'esnext',
  },
  plugins: [
    tailwindcss(),
    webExtension({
      manifest: 'manifest-chrome.json',
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    open: false, // prevent automatic browser opening
  },
})
