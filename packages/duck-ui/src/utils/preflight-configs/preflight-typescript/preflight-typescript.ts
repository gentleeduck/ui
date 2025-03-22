import { Ora } from 'ora'
import { highlighter } from '../../text-styling'
import path from 'node:path'
import fs from 'fs-extra'
import prompts from 'prompts'
import { typescript_prompts } from './preflight-typescript.constants'
import {
  adding_typescript_config,
  install_typescript,
} from './preflight-typescript.libs'
import { preflight_typescript_options_schema } from './preflight-typescript.dto'

export async function preflight_typescript(cwd: string, spinner: Ora) {
  try {
    spinner.text = `${highlighter.info('Checking for TypeScript...')}`
    const is_ts_installed = await fs.pathExists(
      path.resolve(cwd, 'tsconfig.json'),
    )
    if (is_ts_installed) {
      spinner.text = `${highlighter.info('TypeScript is already installed...')}`
      return
    }

    spinner.stop()
    const options = await prompts(typescript_prompts)
    const { typescript } = preflight_typescript_options_schema.parse(options)

    console.log(typescript)
    spinner.start()
    if (!typescript) {
      spinner.text = `${highlighter.info('TypeScript is not installed...')}`
      process.exit(0)
    }

    await install_typescript(cwd, spinner)
    await adding_typescript_config(cwd, spinner)
  } catch (error) {
    spinner.text = `${highlighter.info('TypeScript is not installed...')}${highlighter.error(error as string)}`
    process.exit(0)
  }
}
