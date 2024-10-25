import { checkTailwindCssInstalled } from '../checkers'
import prompts from 'prompts'
import { tailwindcss_prompts } from './pref-light-tailwindcss.constants'
import { pref_light_options_schema } from './pref-light-tailwindcss.dto'
import { get_project_type } from '../get-project-type'
import { spinner } from '../spinner'
import { highlighter, logger } from '../text-styling'
import { tailwindCssInstallationGuide } from '../get-project-info'
import { install_tailwindcss } from './pref-light-tailwindcss.lib'

export async function pref_light_tailwindcss(
  cwd: string,
  typescript: boolean
): Promise<void> {
  const is_tailwind_installed = await checkTailwindCssInstalled(cwd)

  if (is_tailwind_installed) return

  logger.info({ args: [tailwindCssInstallationGuide] })

  const options = await prompts(tailwindcss_prompts)
  const { tailwind } = pref_light_options_schema.parse(options)

  if (!tailwind) return

  const type = await get_project_type(cwd)
  await install_tailwindcss(cwd, type, typescript)
}
