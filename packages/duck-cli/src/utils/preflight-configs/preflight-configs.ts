import path from 'node:path'
import type { Ora } from 'ora'
import type { InitOptions } from '~/commands/init'
import { highlighter } from '../text-styling'
import { preflight_duckui } from './preflight-duckui'
import { preflight_tailwindcss } from './preflight-tailwindcss'
import { preflight_typescript } from './preflight-typescript'

export async function preflight_configs(_options: InitOptions, spinner: Ora): Promise<void> {
  try {
    spinner.text = `${highlighter.info('Preflighting required configs...')}`
    const setup_cwd =
      _options.monorepo && _options.workspace ? path.resolve(_options.cwd, _options.workspace) : _options.cwd

    await preflight_typescript({ ..._options, cwd: setup_cwd }, spinner)
    await preflight_tailwindcss({ ..._options, cwd: setup_cwd }, spinner)
    await preflight_duckui(_options, spinner)

    spinner.text = `${highlighter.info('Configs preflighted...')}`
  } catch (error) {
    spinner.fail(
      `Failed to preflight required configs...\n ${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    process.exit(1)
  }
}
