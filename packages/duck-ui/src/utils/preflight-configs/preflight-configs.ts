import { Ora } from 'ora'
import { InitOptions } from '~/commands/init'
import { highlighter } from '../text-styling'
import { preflight_duckui } from './preflight-duckui'
import { preflight_tailwindcss } from './preflight-tailwindcss'
import { preflight_typescript } from './preflight-typescript'
import { preflight_theme } from './preflight-theme'

export async function preflight_configs(_options: InitOptions, spinner: Ora): Promise<void> {
  try {
    spinner.text = `${highlighter.info('Preflighting required configs...')}`
    await preflight_typescript(_options, spinner)
    await preflight_tailwindcss(_options, spinner)
    await preflight_duckui(_options, spinner)

    // await preflight_theme(_options, spinner)

    spinner.text = `${highlighter.info('Configs preflighted...')}`
  } catch (error) {
    spinner.fail(`Failed to preflight required configs...\n ${highlighter.error(error as string)}`)
    process.exit(0)
  }
}
