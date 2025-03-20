#!/usr/bin/env node
// This is the main file of the duck-ui CLI application written with TypeScript

import { init } from './main'

// INIT START

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

init()
// INIT END
