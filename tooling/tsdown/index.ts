import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'tsdown'

type TsdownConfig = Parameters<typeof defineConfig>[0]

/** @type {TsdownConfig} */
export const config: TsdownConfig = {
  plugins: [react() as never],
  entry: ['./index.ts'],
  outDir: './dist',
  format: 'esm',
  platform: 'neutral',
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  clean: true,
  target: 'esnext',
  sourcemap: true,
  treeshake: true,
  onSuccess: () => {
    console.info('Build successful')
  },
  shims: true,
  dts: true,
  minify: true,
}
