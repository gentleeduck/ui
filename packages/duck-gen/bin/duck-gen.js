#!/usr/bin/env node
// 🦆 Duck Gen CLI shim (prefers compiled output, falls back to tsx for dev).
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const distPath = fileURLToPath(new URL('../dist/index.js', import.meta.url))
if (existsSync(distPath)) {
  const result = spawnSync(process.execPath, [distPath], { stdio: 'inherit' })
  if (result.error) {
    console.error(result.error)
    process.exit(1)
  }
  process.exit(result.status ?? 1)
}

const srcPath = fileURLToPath(new URL('../src/index.ts', import.meta.url))
if (existsSync(srcPath)) {
  const require = createRequire(import.meta.url)
  const loaderPath = require.resolve('tsx/esm')

  const result = spawnSync(process.execPath, ['--import', loaderPath, srcPath], {
    stdio: 'inherit',
  })

  if (result.error) {
    console.error(result.error)
    process.exit(1)
  }

  process.exit(result.status ?? 1)
}

console.error('Duck Gen is missing its runtime build. Please reinstall the package or rebuild it.')
process.exit(1)
