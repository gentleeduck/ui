import { execa } from 'execa'
import path from 'node:path'
import {
  get_package_manager,
  getPackageRunner,
} from '../../get-package-manager'
import { spinner } from '../../spinner'
import { highlighter, logger } from '../../text-styling'
import {
  default_config,
  tailwindcss_dependencies,
  tailwindcss_init,
  tailwindcss_prompts,
} from './pref-light-tailwindcss.constants'
import fs from 'fs-extra'
import {
  get_project_type,
  ProjectType,
  ProjectTypeEnum,
} from '../../get-project-type'
import { Ora } from 'ora'
import { IGNORED_DIRECTORIES } from '../../get-project-info'
import fg from 'fast-glob'
import { ZodError } from 'zod'
import prompts from 'prompts'
import { pref_light_tailwindcss_options_schema } from './pref-light-tailwindcss.dto'

// Check if TailwindCss is installed
export async function checkTailwindCssInstalled(cwd: string, spinner: Ora) {
  try {
    spinner.text = `${highlighter.info('Checking for TailwindCss...')}`

    const tailwindcss = fg.globSync('tailwind.config.*', {
      cwd,
      deep: 1,
      ignore: IGNORED_DIRECTORIES,
    })

    if (tailwindcss.length) {
      spinner.text = `${highlighter.info('TailwindCss is already installed...')}`
      return true
    }

    const options = await prompts(tailwindcss_prompts)
    const { tailwind } = pref_light_tailwindcss_options_schema.parse(options)

    if (!tailwind) return

    await install_tailwindcss(cwd)

    return true
  } catch (error) {
    if (error instanceof ZodError) {
      spinner.text = `${highlighter.error('Wrong Options..')}${highlighter.error(error.message)}`
    }

    spinner.text = `${highlighter.error('TailwindCss is not installed...')}${highlighter.error(error as string)}`
    process.exit(0)
  }
}

export async function install_tailwindcss(cwd: string, spinner: Ora) {
  spinner.text = `${highlighter.info('Installing TailwindCSS...')}`

  const packageManager = await get_package_manager(cwd)
  const { failed: installation_step_1 } = await execa(
    packageManager,
    [packageManager !== 'npm' ? 'install' : 'add', ...tailwindcss_dependencies],
    {
      cwd: cwd,
      shell: true,
    },
  )
  if (installation_step_1) return spinner.fail(`${installation_step_1}`)

  const packageRunner = await getPackageRunner(cwd, packageManager)
  const { failed: installation_step_2 } = await execa(
    packageRunner,
    [...tailwindcss_init],
    {
      cwd: cwd,
      shell: true,
    },
  )
  if (installation_step_2) return spinner.fail(`${installation_step_2}`)

  await adding_tailwind_config(cwd)

  spinner.text = `${highlighter.info('TailwindCSS is installed...')}`
}

export async function adding_tailwind_config(cwd: string) {
  const is_ts = false //await check_typeScript_installed(cwd)
  const type = await get_project_type(cwd)

  const tailwind_config_spinner = spinner(
    highlighter.info('Adding TailwindCSS config...'),
  ).start()

  if (is_ts) {
    await execa(
      `mv ${path.join(cwd, 'tailwind.config.js')} ${path.join(cwd, `tailwind.config.ts`)}`,
      {
        shell: true,
        cwd,
      },
    )
  }

  await fs.writeFile(
    path.join(cwd, `tailwind.config.${is_ts ? 'ts' : 'js'}`),
    tailwind_config(type),
  )

  await fs.writeFile(
    path.join(cwd, css_file_path(type)),
    css_file_content(type),
  )

  logger.break()
  tailwind_config_spinner.succeed()
}

// NOTE: you have to support other types of projects
export const tailwind_config = (type: keyof typeof ProjectTypeEnum) => {
  return type === 'UNKNOWN' ? default_config : default_config
}

export const css_file_path = (type: keyof typeof ProjectTypeEnum) => {
  return type === 'UNKNOWN' ? './style.css' : './style.css'
}

export function css_file_content(type: keyof typeof ProjectTypeEnum) {
  return type === 'UNKNOWN'
    ? default_css_without_duckui
    : default_css_without_duckui
}
