import type { Ora } from 'ora'
import prompts from 'prompts'
import type { InitOptions } from '~/commands/init'
import { highlighter } from '../../text-styling'
import { tailwindcss_prompts } from './pref-light-tailwindcss.constants'
import { pref_light_tailwindcss_options_schema } from './pref-light-tailwindcss.dto'
import { checkTailwindCssInstalled, install_tailwindcss } from './pref-light-tailwindcss.lib'

export async function preflight_tailwindcss(_options: InitOptions, spinner: Ora): Promise<void> {
  try {
    spinner.text = `Preflighting required ${highlighter.info('TailwindCss')} configs...`
    const is_tailwind_installed = await checkTailwindCssInstalled(_options.cwd, spinner)
    if (is_tailwind_installed) {
      spinner.text = `${highlighter.info('TailwindCss')} is already installed...`
      return
    }

    if (!_options.yes) {
      spinner.stop()
      const options = await prompts(tailwindcss_prompts)
      spinner.start()
      const { tailwind } = pref_light_tailwindcss_options_schema.parse(options)

      if (!tailwind) {
        spinner.text = `${highlighter.info('TailwindCss')} is not installed...`
        return
      }
    }

    await install_tailwindcss(_options.cwd, spinner)
  } catch (error) {
    spinner.fail(
      `Failed to preflight required ${highlighter.error('TailwindCss')} configs...\n ${highlighter.error(
        error as string,
      )}`,
    )
    process.exit(0)
  }
}
