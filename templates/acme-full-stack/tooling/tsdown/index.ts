import react from '@vitejs/plugin-react-swc'
import type { defineConfig } from 'tsdown'

type TsdownConfig = Parameters<typeof defineConfig>[0]

export const config: TsdownConfig = {
  clean: true,
  dts: { sourcemap: false },
  entry: ['./index.ts'],
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  format: 'esm',
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  minify: true,
  onSuccess: () => {
    console.info('Build successful')
  },
  outDir: './dist',
  platform: 'neutral',
  plugins: [react() as never],
  shims: true,
  sourcemap: false,
  target: 'esnext',
  treeshake: true,
}
