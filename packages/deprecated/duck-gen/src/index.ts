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
  const sharedOutputSources = normalizeOutputSource(extensions.shared.outputSource)
  const apiOutputSources = normalizeOutputSource(
    resolveOutputSource(extensions.apiRoutes.outputSource, extensions.apiRoutes.outputPath),
  )
  const messageOutputSources = normalizeOutputSource(
    resolveOutputSource(extensions.messages.outputSource, extensions.messages.outputPath),
  )

  const outputPaths = {
    apiRoutes: resolveOutputTargets([...sharedOutputSources, ...apiOutputSources], defaultOutputs.apiRoutes, cwd),
    messages: resolveOutputTargets([...sharedOutputSources, ...messageOutputSources], defaultOutputs.messages, cwd),
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

function resolveOutputTargets(entries: string[], defaultPath: string, cwd: string): string[] {
  const fileName = path.basename(defaultPath)
  const targets = [defaultPath]

  for (const entry of entries) {
    targets.push(resolveOutputTarget(entry, cwd, fileName))
  }

  return uniqueStrings(targets)
}

function resolveOutputTarget(entry: string, cwd: string, defaultFileName: string): string {
  const resolved = path.isAbsolute(entry) ? entry : path.resolve(cwd, entry)
  if (!path.extname(resolved)) {
    return path.join(resolved, defaultFileName)
  }
  return ensureDtsExtension(resolved)
}

function ensureDtsExtension(filePath: string): string {
  if (filePath.endsWith('.d.ts')) return filePath
  const ext = path.extname(filePath)
  if (!ext) return `${filePath}.d.ts`
  return `${filePath.slice(0, -ext.length)}.d.ts`
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
