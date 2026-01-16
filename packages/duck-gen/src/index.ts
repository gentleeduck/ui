import chalk from 'chalk'
import ora from 'ora'
import path from 'node:path'
import { load_duckgen_config as loadDuckGenConfig } from './config'
import { emitFrameworkIndex, emitGeneratedIndex, getFrameworkOutputPaths, resolveFrameworkKey } from './core/paths'
import type { DuckGenOutputTargets } from './core/types'
import { getFrameworkProcessor } from './framework'

export const spinner = ora({
  color: 'yellow',
})

async function run() {
  spinner.start('Loading config...')
  const { extensions, framework } = await loadDuckGenConfig()
  spinner.succeed('Config loaded')

  const frameworkKey = resolveFrameworkKey(framework)
  const cwd = process.cwd()
  const apiRoutesOutputs = resolveOutputPaths(extensions.apiRoutes.outputPath, cwd)
  const messagesOutputs = resolveOutputPaths(extensions.messages.outputPath, cwd)

  const outputPaths = getFrameworkOutputPaths(frameworkKey, {
    apiRoutes: apiRoutesOutputs?.[0],
    messages: messagesOutputs?.[0],
  })
  const outputTargets: DuckGenOutputTargets = {
    apiRoutes: apiRoutesOutputs ?? [outputPaths.apiRoutes],
    messages: messagesOutputs ?? [outputPaths.messages],
  }

  spinner.start('Processing...')
  await getFrameworkProcessor(framework)(extensions, outputTargets)
  spinner.succeed('Processing done')

  emitFrameworkIndex(outputPaths)
  emitGeneratedIndex()
}

function resolveOutputPaths(value: string | string[] | undefined, cwd: string): string[] | undefined {
  if (!value) return undefined
  const list = Array.isArray(value) ? value : [value]
  const resolved = list
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => (path.isAbsolute(entry) ? entry : path.resolve(cwd, entry)))

  if (!resolved.length) return undefined

  const seen = new Set<string>()
  const unique: string[] = []
  for (const entry of resolved) {
    if (seen.has(entry)) continue
    seen.add(entry)
    unique.push(entry)
  }
  return unique.length ? unique : undefined
}

run().catch((error) => {
  spinner.fail('Duck Gen failed.')
  console.error(chalk.red(error instanceof Error ? error.message : String(error)))
  process.exit(1)
})
