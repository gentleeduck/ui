import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { type PackageJson } from 'type-fest'
import { logger } from '../text-styling'
import { IGNORED_DIRECTORIES } from './get-project-info.constants'

// Get package.json
export function getPackageJson(): PackageJson | null {
  const files = fg.sync(['package.json'], {
    cwd: process.cwd(),
    deep: 1,
    ignore: IGNORED_DIRECTORIES,
  })

  if (!files.length) {
    logger.error({ args: ['package.json not found'] })
    return process.exit(1)
  }

  const packageJsonPath = path.join(process.cwd(), 'package.json')

  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  return packageJson
}
