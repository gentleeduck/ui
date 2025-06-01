import react from '@vitejs/plugin-react-swc'

import { resolve } from 'node:path'
import { defineConfig } from 'vite'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
    outDir: './dist/App.tsx',
    lib: {
      entry: resolve(__dirname, 'src/App.tsx'),
      name: 'duck-benchmark',
      fileName: 'App.tsx',
      formats: ['es'],
    },
  },
  plugins: [react()],
})
