import fg from 'fast-glob'
import fs from 'fs-extra'
import { IGNORED_DIRECTORIES } from './get-project-info.constants'
import path from 'path'
import { loadConfig } from 'tsconfig-paths'
import { type PackageJson } from 'type-fest'

// Get TailwindCss File
export async function get_tailwindcss_file(cwd: string) {
  const files = fg.sync(['**/*.css', '**/*.scss', '**/*.sass'], {
    cwd,
    deep: 3,
    ignore: IGNORED_DIRECTORIES
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
  const tsConfig = loadConfig(cwd)

  if (tsConfig.resultType === 'failed' || !tsConfig.paths) {
    return null
  }

  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (paths.includes('./src/*') || paths.includes('./*')) {
      return alias.at(0)
    }
  }

  return null
}

// Get package.json
export function getPackageJson(): PackageJson {
  const packageJsonPath = path.join('package.json')

  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
}
