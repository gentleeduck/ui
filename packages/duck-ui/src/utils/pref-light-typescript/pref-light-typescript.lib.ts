import fs from 'fs-extra'
import path from 'path'
import { spinner } from '../spinner'
import { highlighter, logger } from '../text-styling'
import { get_package_manager } from '../get-package-manager'
import { execa } from 'execa'
import {
  js_config,
  ts_config,
  typescript_dependencies
} from './pref-light-typescript.constants'

export async function install_typescript(cwd: string, typescript: boolean) {
  const install_spinner = spinner(
    highlighter.info('Installing TypeScript...')
  ).start()

  const packageManager = await get_package_manager(cwd)
  const { failed: installation_step_1 } = await execa(
    packageManager,
    [
      packageManager !== 'npm' ? 'install' : 'add',
      ...typescript_dependencies,
      '-D'
    ],
    {
      cwd: cwd,
      shell: true
    }
  )
  if (installation_step_1) return install_spinner.fail()

  // Replacing default config with tailwind config that matches the project type
  await adding_typescript_config(cwd, typescript)

  logger.break()
  install_spinner.succeed()
}

export async function adding_typescript_config(cwd: string, is_ts: boolean) {
  const tailwind_config_spinner = spinner(
    highlighter.info('Adding TypeScript config...')
  ).start()

  await fs.writeFile(
    path.join(cwd, `${is_ts ? 'ts' : 'js'}config.json`),
    is_ts ? ts_config : js_config
  )

  logger.break()
  tailwind_config_spinner.succeed()
}

// Check if TypeScript is installed
export async function checkTypeScriptInstalled(cwd: string) {
  return fs.pathExists(path.resolve(cwd, 'tsconfig.json'))
}
