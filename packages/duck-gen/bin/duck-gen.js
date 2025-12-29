#!/usr/bin/env node
// 🦆 Duck Gen CLI shim (runs the TypeScript entry with the tsx loader).
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const loaderPath = require.resolve('tsx/esm')
const entryPath = fileURLToPath(new URL('../src/index.ts', import.meta.url))

const result = spawnSync(process.execPath, ['--import', loaderPath, entryPath], {
  stdio: 'inherit',
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
