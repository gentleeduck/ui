#!/usr/bin/env node

import { init } from './main/index'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

init().catch((error) => {
  console.error(error instanceof Error ? (error.stack ?? error.message) : String(error))
  process.exit(1)
})
