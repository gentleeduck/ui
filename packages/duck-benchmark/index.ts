#!/usr/bin/env node
// This is the main file of the @gentleduck/cli application written with TypeScript

import { init } from './src/main'

// INIT START

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

init()
// INIT END
