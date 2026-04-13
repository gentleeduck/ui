import path from 'node:path'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import type { InitOptions } from '~/commands/init'
import { highlighter } from '../../text-styling'
import { typescriptPrompts } from './preflight-typescript.constants'
import { preflightTypescriptOptionsSchema } from './preflight-typescript.dto'
import { addingTypescriptConfig, installTypescript } from './preflight-typescript.libs'

export async function preflightTypescript(_options: InitOptions, spinner: Ora) {
  try {
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
  } catch (error) {
    spinner.fail(
      `Failed to preflight required ${highlighter.error('TypeScript')} configs...\n ${highlighter.error(
        error instanceof Error ? error.message : String(error),
      )}`,
    )
    process.exit(1)
  }
}
