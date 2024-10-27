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
import { get_project_type, ProjectType } from '../get-project-type'
import { checkTypeScriptInstalled } from '../pref-light-typescript'

export async function install_tailwindcss(cwd: string) {
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
  await adding_tailwind_config(cwd)

  install_spinner.succeed()
}

export async function adding_tailwind_config(cwd: string) {
  const is_ts = await checkTypeScriptInstalled(cwd)
  const type = await get_project_type(cwd)

  const tailwind_config_spinner = spinner(
    highlighter.info('Adding TailwindCSS config...')
  ).start()

  if (is_ts) {
    await execa(
      `mv ${path.join(cwd, 'tailwind.config.js')} ${path.join(cwd, `tailwind.config.ts`)}`,
      { shell: true, cwd }
    )
  }

  await fs.writeFile(
    path.join(cwd, `tailwind.config.${is_ts ? 'ts' : 'js'}`),
    tailwind_config(type)
  )

  await fs.writeFile(
    path.join(cwd, css_file_path(type)),
    css_file_content(type)
  )

  logger.break()
  tailwind_config_spinner.succeed()
}

// NOTE: you have to support other types of projects
export const tailwind_config = (type: ProjectType) => {
  return type === 'UNKNOWN' ? default_config : default_config
}

export const css_file_path = (type: ProjectType) => {
  return type === 'UNKNOWN' ? './style.css' : './style.css'
}

export function css_file_content(type: ProjectType) {
  return type === 'UNKNOWN'
    ? default_css_without_duckui
    : default_css_without_duckui
}

export const default_css_without_duckui = `@tailwind base;
@tailwind components;
@tailwind utilities;
`
