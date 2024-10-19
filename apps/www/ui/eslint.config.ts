import js from '@eslint/js'
import globals from 'globals'
import tseslint, { Config } from 'typescript-eslint'

const eslintConfig: Config = tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ['**/*.{ts,tsx}'],
  ignores: ['dist'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {},
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
})

export default eslintConfig
