import baseConfig, { restrictEnvAccess } from '@duck/eslint-config/base'
import nextjsConfig from '@duck/eslint-config/nextjs'
import reactConfig from '@duck/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
]
