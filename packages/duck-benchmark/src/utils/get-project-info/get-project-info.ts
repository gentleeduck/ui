import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { type PackageJson } from 'type-fest'
import { logger } from '../text-styling'
import { IGNORED_DIRECTORIES } from './get-project-info.constants'

// Get package.json
export function get_package_json(): PackageJson | null {
  const files = fg.sync(['package.json'], {
    cwd: process.cwd(),
    deep: 1,
    ignore: IGNORED_DIRECTORIES,
  })

  if (!files.length) {
    logger.error({ args: ['package.json not found'] })
    return process.exit(1)
  }

  const package_json_path = path.join(process.cwd(), 'package.json')

  const package_json: PackageJson = JSON.parse(fs.readFileSync(package_json_path, 'utf8'))

  return package_json
}
