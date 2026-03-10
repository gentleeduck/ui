import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  minify: false,
  outDir: 'dist',
  sourcemap: true,
  target: 'esnext',
  treeshake: true,
})
