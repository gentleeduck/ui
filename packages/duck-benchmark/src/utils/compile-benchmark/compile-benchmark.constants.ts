import { FileInfo } from '../list-files'

export const VITE_CONFIG_CONTENT = ({ fileInfo }: { fileInfo: FileInfo }) => `
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, '${fileInfo.path}'),
      name: 'App',
      fileName: () => '${fileInfo.name.replace(/\.(ts|tsx)$/, '.js')}',
      formats: ['es'],
    },
  },
})
`
