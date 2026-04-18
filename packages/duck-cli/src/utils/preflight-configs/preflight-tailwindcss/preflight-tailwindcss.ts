import type { Ora } from 'ora'
import prompts from 'prompts'
import type { InitOptions } from '~/commands/init'
import { highlighter } from '../../text-styling'
import { tailwindcssPrompts } from './preflight-tailwindcss.constants'
import { preflightTailwindcssOptionsSchema } from './preflight-tailwindcss.dto'
import { checkTailwindCssInstalled, installTailwindcss } from './preflight-tailwindcss.lib'

export async function preflightTailwindcss(_options: InitOptions, spinner: Ora): Promise<void> {
  try {
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
      await installTailwindcss(
        _options.cwd,
        spinner,
        _options.projectType || 'VITE',
        _options.css || './src/styles.css',
      )
    } else {
      await installTailwindcss(_options.cwd, spinner)
    }
  } catch (error) {
    spinner.fail(
      `Failed to preflight required ${highlighter.error('TailwindCss')} configs...\n ${highlighter.error(
        error instanceof Error ? error.message : String(error),
      )}`,
    )
    process.exit(1)
  }
}
