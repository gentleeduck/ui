import { FileInfo } from '../list-files'

// Generate a temporary Vite config file
export const VITE_CONFIG_CONTENT = ({ fileInfo }: { fileInfo: FileInfo }) => `
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  build: {
    sourcemap: false,
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, '${fileInfo.path}'), 
      name: 'App',
      fileName: () => '${fileInfo.name.replace(/\.(ts|tsx)$/, '.js')}', // Output as App.js (JSX isn't valid output)
      formats: ['es'], // ESM format
    },
  },
  plugins: [react()],
})
    `
