import prompts from 'prompts'
import { tailwindcss_prompts } from './pref-light-tailwindcss.constants'
import { pref_light_tailwindcss_options_schema } from './pref-light-tailwindcss.dto'
import {
  checkTailwindCssInstalled,
  install_tailwindcss,
} from './pref-light-tailwindcss.lib'
import { highlighter, logger } from '../../text-styling'
import { Ora } from 'ora'

export async function preflight_tailwindcss(
  cwd: string,
  spinner: Ora,
): Promise<void> {
  spinner.text = `${highlighter.info('Preflighting required TailwindCss configs...')}`
  const is_tailwind_installed = await checkTailwindCssInstalled(cwd, spinner)

  if (is_tailwind_installed) return
}
