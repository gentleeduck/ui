#!/usr/bin/env bun
// 🦆 Duck Gen CLI shim (prefers compiled output, falls back to source for dev).
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const bunExec = process.execPath || 'bun'
const distPath = fileURLToPath(new URL('../dist/index.js', import.meta.url))
if (existsSync(distPath)) {
  const result = spawnSync(bunExec, [distPath], { stdio: 'inherit' })
  if (result.error) {
    console.error(result.error)
    process.exit(1)
  }
  process.exit(result.status ?? 1)
}

const srcPath = fileURLToPath(new URL('../src/index.ts', import.meta.url))
if (existsSync(srcPath)) {
  const result = spawnSync(bunExec, [srcPath], { stdio: 'inherit' })

  if (result.error) {
    console.error(result.error)
    process.exit(1)
  }

  process.exit(result.status ?? 1)
}

console.error('Duck Gen is missing its runtime build. Please reinstall the package or rebuild it.')
process.exit(1)
