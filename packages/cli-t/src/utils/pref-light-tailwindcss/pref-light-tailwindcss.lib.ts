import { execa } from 'execa'
import path from 'path'
import { get_package_manager, getPackageRunner } from '../get-package-manager'
import { spinner } from '../spinner'
import { highlighter, logger } from '../text-styling'
import {
  default_config,
  tailwindcss_dependencies,
  tailwindcss_init
} from './pref-light-tailwindcss.constants'
import fs from 'fs-extra'
import { ProjectType } from '../get-project-type'

export async function install_tailwindcss(
  cwd: string,
  type: ProjectType,
  typescript: boolean
) {
  const install_spinner = spinner(
    highlighter.info('Installing TailwindCSS...')
  ).start()

  const packageManager = await get_package_manager(cwd)
  const { failed: installation_step_1 } = await execa(
    packageManager,
    [packageManager !== 'npm' ? 'install' : 'add', ...tailwindcss_dependencies],
    {
      cwd: cwd,
      shell: true
    }
  )
  if (installation_step_1) return install_spinner.fail()

  const packageRunner = await getPackageRunner(cwd, packageManager)
  const { failed: installation_step_2 } = await execa(
    packageRunner,
    [...tailwindcss_init],
    {
      cwd: cwd,
      shell: true
    }
  )
  if (installation_step_2) return install_spinner.fail()

  // Replacing default config with tailwind config that matches the project type
  await adding_tailwind_config(cwd, type, typescript)

  logger.break()
  install_spinner.succeed()
}

export async function adding_tailwind_config(
  cwd: string,
  type: ProjectType,
  typescript: boolean
) {
  const tailwind_config_spinner = spinner(
    highlighter.info('Adding TailwindCSS config...')
  ).start()

  await fs.writeFile(
    path.join(cwd, `tailwind.config.${typescript ? 'ts' : 'js'}`),
    tailwind_config(type)
  )

  logger.break()
  tailwind_config_spinner.succeed()
}

// NOTE: you have to support other types of projects
export const tailwind_config = (type: ProjectType) => {
  return type === 'UNKNOWN' ? default_config : default_config
}
