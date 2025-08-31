import { Ora } from 'ora'
import { highlighter } from '../../text-styling'
import path from 'node:path'
import fs from 'fs-extra'
import prompts from 'prompts'
import { typescript_prompts } from './preflight-typescript.constants'
import { adding_typescript_config, install_typescript } from './preflight-typescript.libs'
import { preflight_typescript_options_schema } from './preflight-typescript.dto'
import { InitOptions } from '~/commands/init'

export async function preflight_typescript(_options: InitOptions, spinner: Ora) {
  try {
    spinner.text = `Checking for ${highlighter.info('TypeScript')}...`
    const is_ts_installed = await fs.pathExists(path.resolve(_options.cwd, 'tsconfig.json'))
    if (is_ts_installed) {
      spinner.text = `${highlighter.info('TypeScript')} is already installed...`
      return
    }

    if (!_options.yes) {
      spinner.stop()
      const options = await prompts(typescript_prompts)
      const { typescript } = preflight_typescript_options_schema.parse(options)
      spinner.start()

      if (!typescript) {
        spinner.text = `${highlighter.info('TypeScript')} is not installed...`
        process.exit(0)
      }
    }

    await install_typescript(_options.cwd, spinner)
    await adding_typescript_config(_options.cwd, spinner)
  } catch (error) {
    spinner.fail(
      `Failed to preflight required ${highlighter.error('TypeScript')} configs...\n ${highlighter.error(
        error as string,
      )}`,
    )
    process.exit(0)
  }
}
