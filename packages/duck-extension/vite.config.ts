import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import webExtension from 'vite-plugin-web-extension'

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    emptyOutDir: true,
    minify: 'esbuild',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('lucide-react')) {
            return 'icons-vendor'
          }

          if (
            id.includes('/packages/registry-ui/') ||
            id.includes('/packages/duck-primitives/') ||
            id.includes('/packages/duck-hooks/') ||
            id.includes('/packages/duck-libs/') ||
            id.includes('/packages/duck-motion/') ||
            id.includes('react-day-picker') ||
            id.includes('react-resizable-panels') ||
            id.includes('embla-carousel-react') ||
            id.includes('vaul') ||
            id.includes('sonner')
          ) {
            return 'ui-vendor'
          }

          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor'
          }

          if (id.includes('/node_modules/')) {
            return 'vendor'
          }

          return undefined
        },
      },
    },
    sourcemap: false,
    target: 'esnext',
  },
  plugins: [
    tailwindcss(),
    webExtension({
      disableAutoLaunch: true,
      manifest: 'manifest-chrome.json',
      watchFilePaths: ['src/**/*.{ts,tsx}'],
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
