import baseConfig from '@acme/vitest-config'
import swc from 'unplugin-swc'
import { mergeConfig } from 'vitest/config'

export default mergeConfig(baseConfig, {
  plugins: [swc.vite()],
  test: {
    root: './',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
  },
})
