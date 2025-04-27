import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./index.ts'],
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
  target: 'esnext',
  treeshake: true,
  shims: true, // ✅ Add this to resolve JSX issues
})
