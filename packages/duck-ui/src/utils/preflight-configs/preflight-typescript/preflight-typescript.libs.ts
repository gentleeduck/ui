import { Ora } from 'ora'
import { highlighter } from '../../text-styling'
import { get_package_manager } from '../../get-package-manager'
import { execa } from 'execa'
import { ts_config, typescript_dependencies } from './preflight-typescript.constants'
import fs from 'fs-extra'
import path from 'node:path'

export async function install_typescript(cwd: string, spinner: Ora) {
  try {
    spinner.text = `Installing ${highlighter.info('TypeScript')}...`

    spinner.text = `Get ${highlighter.info('package manager')}...`
    const packageManager = await get_package_manager(cwd)

    spinner.text = `Installing ${highlighter.info('TypeScript')}...`
    const { failed: installation_step_1 } = await execa(
      packageManager,
      [packageManager !== 'npm' ? 'install' : 'add', ...typescript_dependencies, '-D'],
      {
        cwd: cwd,
        shell: true,
      },
    )
    if (!installation_step_1) return

    spinner.fail(`${installation_step_1}`)
    process.exit(0)
  } catch (error) {
    spinner.fail(`${highlighter.error(error as string)}`)
    process.exit(0)
  }
}

// Add Typescript config
export async function adding_typescript_config(cwd: string, spinner: Ora) {
  spinner.text = `Adding ${highlighter.info('TypeScript')} config...`

  await fs.writeFile(path.join(cwd, 'tsconfig.json'), ts_config, 'utf-8')
}
