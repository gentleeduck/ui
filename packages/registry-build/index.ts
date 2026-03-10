#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { init } from './src/main'

const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : null
const entryPath = fileURLToPath(import.meta.url)

if (executedPath === entryPath) {
  process.on('SIGINT', () => process.exit(0))
  process.on('SIGTERM', () => process.exit(0))
  await init()
}

export * from './src'
