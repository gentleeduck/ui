import { defineConfig } from 'tsdown'

export default defineConfig({
  alias: {
    '@duck-docs': './src',
  },
  clean: true,
  dts: true,
  entry: ['src/**/*.{ts,tsx}', '!src/**/__test__/**'],
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  format: 'esm',
  minify: true,
  onSuccess: () => {
    console.info('Build successful')
  },
  outDir: './dist',
  platform: 'neutral',
  plugins: [],
  shims: true,
  sourcemap: false,
  target: 'esnext',
  treeshake: true,
})
