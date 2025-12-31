import chalk from 'chalk'
import ora from 'ora'
import { load_duckgen_config as loadDuckGenConfig } from './config'
import { emitFrameworkIndex, emitGeneratedIndex, getFrameworkOutputPaths, resolveFrameworkKey } from './core/paths'
import { getFrameworkProcessor } from './framework'

export const spinner = ora({
  color: 'yellow',
})

async function run() {
  spinner.start('Loading config...')
  const { extensions, framework } = await loadDuckGenConfig()
  spinner.succeed('Config loaded')

  const frameworkKey = resolveFrameworkKey(framework)
  const outputPaths = getFrameworkOutputPaths(frameworkKey)

  spinner.start('Processing...')
  await getFrameworkProcessor(framework)(extensions, outputPaths)
  spinner.succeed('Processing done')

  emitFrameworkIndex(outputPaths)
  emitGeneratedIndex()
}

run().catch((error) => {
  spinner.fail('Duck Gen failed.')
  console.error(chalk.red(error instanceof Error ? error.message : String(error)))
  process.exit(1)
})
