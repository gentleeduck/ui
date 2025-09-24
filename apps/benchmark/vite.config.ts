import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-oxc'

// import Inspect from 'vite-plugin-inspect'
import Sonda from 'sonda/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  // @ts-ignore
  plugins: [react(), tailwindcss(), Sonda()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
