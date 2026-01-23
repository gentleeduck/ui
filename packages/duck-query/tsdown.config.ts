export default {
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  minify: true,
  outDir: 'dist',
  platform: 'neutral',
  shims: true,
  sourcemap: false,
  target: 'esnext',
  treeshake: true,
}
