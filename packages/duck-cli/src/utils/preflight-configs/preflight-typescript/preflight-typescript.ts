import path from 'node:path'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import type { InitOptions } from '~/commands/init'
import { highlighter } from '../../text-styling'
import { typescriptPrompts } from './preflight-typescript.constants'
import { preflightTypescriptOptionsSchema } from './preflight-typescript.dto'
import { addingTypescriptConfig, installTypescript } from './preflight-typescript.libs'

/** Errors propagate to `preflightConfigs` → `initCommandAction` which renders the final fail. */
export async function preflightTypescript(_options: InitOptions, spinner: Ora) {
  spinner.text = `Checking for ${highlighter.info('TypeScript')}...`
  const isTsInstalled = await fs.pathExists(path.resolve(_options.cwd, 'tsconfig.json'))
  if (isTsInstalled) {
    spinner.text = `${highlighter.info('TypeScript')} is already installed...`
    return
  }

  if (!_options.yes) {
    spinner.stop()
    const options = await prompts(typescriptPrompts)
    const { typescript } = preflightTypescriptOptionsSchema.parse(options)
    spinner.start()

    if (!typescript) {
      spinner.text = `${highlighter.info('TypeScript')} is not installed...`
      process.exit(0)
    }
  }

  await installTypescript(_options.cwd, spinner)
  await addingTypescriptConfig(_options.cwd, spinner)
}
