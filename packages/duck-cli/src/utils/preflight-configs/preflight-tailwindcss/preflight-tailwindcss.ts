import type { Ora } from 'ora'
import prompts from 'prompts'
import type { InitOptions } from '~/commands/init'
import { highlighter } from '../../text-styling'
import { tailwindcssPrompts } from './preflight-tailwindcss.constants'
import { preflightTailwindcssOptionsSchema } from './preflight-tailwindcss.dto'
import { checkTailwindCssInstalled, installTailwindcss } from './preflight-tailwindcss.lib'

/** Errors propagate to `preflightConfigs` → `initCommandAction` which renders the final fail. */
export async function preflightTailwindcss(_options: InitOptions, spinner: Ora): Promise<void> {
  spinner.text = `Preflighting required ${highlighter.info('TailwindCss')} configs...`
  const isTailwindInstalled = await checkTailwindCssInstalled(_options.cwd, spinner)
  if (isTailwindInstalled) {
    spinner.text = `${highlighter.info('TailwindCss')} is already installed...`
    return
  }

  if (!_options.yes) {
    spinner.stop()
    const options = await prompts(tailwindcssPrompts)
    spinner.start()
    const { tailwind } = preflightTailwindcssOptionsSchema.parse(options)

    if (!tailwind) {
      spinner.text = `${highlighter.info('TailwindCss')} is not installed...`
      return
    }
  }

  if (_options.yes) {
    // Non-interactive mode: use flag values or defaults
    await installTailwindcss(_options.cwd, spinner, _options.projectType || 'VITE', _options.css || './src/styles.css')
  } else {
    await installTailwindcss(_options.cwd, spinner)
  }
}
