#!/usr/bin/env node
import { init } from './main'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

init().catch(console.error)
