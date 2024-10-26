import { checkTailwindCssInstalled } from '../checkers'
import prompts from 'prompts'
import { tailwindcss_prompts } from './pref-light-tailwindcss.constants'
import { highlighter, logger } from '../text-styling'
import { pref_light_tailwindcss_options_schema } from './pref-light-tailwindcss.dto'
import { install_tailwindcss } from './pref-light-tailwindcss.lib'

export async function pref_light_tailwindcss(cwd: string): Promise<void> {
  const is_tailwind_installed = await checkTailwindCssInstalled(cwd)

  if (is_tailwind_installed) return

  logger.warn({
    args: [
      `${highlighter.info('TailwindCss')} is not installed. You need to install ${highlighter.info('TailwindCss')}...`
    ]
  })

  const options = await prompts(tailwindcss_prompts)
  const { tailwind } = pref_light_tailwindcss_options_schema.parse(options)

  if (!tailwind) return

  await install_tailwindcss(cwd)
}
