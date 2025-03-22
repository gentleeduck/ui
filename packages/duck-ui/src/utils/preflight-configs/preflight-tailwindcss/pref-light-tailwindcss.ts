import { checkTailwindCssInstalled } from './pref-light-tailwindcss.lib'
import { highlighter } from '../../text-styling'
import { Ora } from 'ora'

export async function preflight_tailwindcss(
  cwd: string,
  spinner: Ora,
): Promise<void> {
  spinner.text = `${highlighter.info('Preflighting required TailwindCss configs...')}`
  const is_tailwind_installed = await checkTailwindCssInstalled(cwd, spinner)

  if (is_tailwind_installed) return
}
