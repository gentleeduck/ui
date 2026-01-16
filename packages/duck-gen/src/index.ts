import path from 'node:path'
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
  const cwd = process.cwd()
  const defaultOutputs = getFrameworkOutputPaths(frameworkKey)
  const sharedOutputDirs = resolveSharedOutputDirs(extensions.shared.outputSource, cwd)

  const outputPaths = {
    apiRoutes: resolveOutputTargets(
      resolveOutputSource(extensions.apiRoutes.outputSource, extensions.apiRoutes.outputPath),
      sharedOutputDirs,
      defaultOutputs.apiRoutes,
      cwd,
    ),
    messages: resolveOutputTargets(
      resolveOutputSource(extensions.messages.outputSource, extensions.messages.outputPath),
      sharedOutputDirs,
      defaultOutputs.messages,
      cwd,
    ),
  }

  spinner.start('Processing...')
  await getFrameworkProcessor(framework)(extensions, outputPaths)
  spinner.succeed('Processing done')

  emitFrameworkIndex(outputPaths)
  emitGeneratedIndex()
}

type OutputSource = string | string[] | undefined

function resolveOutputSource(outputSource: OutputSource, outputPath?: string): OutputSource {
  return outputSource ?? outputPath
}

function resolveSharedOutputDirs(value: OutputSource, cwd: string): string[] {
  const entries = normalizeOutputSource(value)
  return uniqueStrings(entries.map((entry) => (path.isAbsolute(entry) ? entry : path.resolve(cwd, entry))))
}

function resolveOutputTargets(
  value: OutputSource,
  sharedDirs: string[],
  defaultPath: string,
  cwd: string,
): string[] {
  const entries = normalizeOutputSource(value)
  const fileName = path.basename(defaultPath)

  if (entries.length) {
    return uniqueStrings(entries.map((entry) => resolveOutputTarget(entry, cwd, fileName)))
  }

  if (sharedDirs.length) {
    return uniqueStrings(sharedDirs.map((dir) => path.join(dir, fileName)))
  }

  return [defaultPath]
}

function resolveOutputTarget(entry: string, cwd: string, defaultFileName: string): string {
  const resolved = path.isAbsolute(entry) ? entry : path.resolve(cwd, entry)
  return path.extname(resolved) ? resolved : path.join(resolved, defaultFileName)
}

function normalizeOutputSource(value: OutputSource): string[] {
  if (!value) return []
  const entries = Array.isArray(value) ? value : [value]
  return entries.map((entry) => entry.trim()).filter(Boolean)
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    if (seen.has(value)) continue
    seen.add(value)
    out.push(value)
  }
  return out
}

run().catch((error) => {
  spinner.fail('Duck Gen failed.')
  console.error(chalk.red(error instanceof Error ? error.message : String(error)))
  process.exit(1)
})
