import fg from 'fast-glob'
import fs from 'fs-extra'
import { IGNORED_DIRECTORIES } from './get-project-info.constants'
import path from 'path'
import { loadConfig } from 'tsconfig-paths'
import { type PackageJson } from 'type-fest'
import { logger } from '../text-styling'

// Get TailwindCss File
export async function get_tailwindcss_file(cwd: string) {
  const files = fg.sync(['**/*.css', '**/*.scss', '**/*.sass'], {
    cwd,
    deep: 3,
    ignore: IGNORED_DIRECTORIES,
  })

  if (!files.length) {
    return null
  }

  for (const file of files) {
    const content = await fs.readFile(path.resolve(cwd, file), 'utf8')

    if (
      content.includes('@tailwind base') ||
      content.includes('@tailwind components') ||
      content.includes('@tailwind utilities')
    ) {
      return file
    }
  }

  return null
}

// Get Ts Config Alias Prefix
export async function get_ts_config_alias_prefix(cwd: string) {
  const ts_config = loadConfig(cwd)

  if (ts_config.resultType === 'failed' || !ts_config.paths) {
    return null
  }

  for (const [alias, paths] of Object.entries(ts_config.paths)) {
    if (paths.includes('./src/*') || paths.includes('./*')) {
      return alias.at(0)
    }
  }

  return null
}

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
