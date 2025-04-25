import { defineConfig } from 'tsdown'
import react from '@vitejs/plugin-react-swc'

type TsdownConfig = Parameters<typeof defineConfig>[0]

/** @type {TsdownConfig} */
export const config: TsdownConfig = {
  plugins: [react() as never],
  entry: ['./index.ts'],
  outDir: './dist',
  format: 'esm',
  onSuccess: () => {
    console.info('Build successful')
  },
  shims: true,
  dts: true,
  minify: true,
}
