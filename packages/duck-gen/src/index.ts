import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import ora from 'ora'
import { emitApiRoutesFile, scanApiRoutes } from './api-routes'
import { loadDuckGenConfig } from './core/config'
import { getFrameworkOutputPaths, getGeneratedIndexPath, resolveFrameworkKey, SUPPORTED_FRAMEWORKS } from './core/paths'
import { build_registry_home } from './home'
import { emitDuckgenMessagesFile, scanDuckgenMessages } from './messages'

const spinner = ora({
  color: 'yellow',
})

async function run() {
  const cwd = process.cwd()
  spinner.start('Loading config...')
  const { config, warnings: configWarnings, configFileFound } = loadDuckGenConfig({ cwd })
  spinner.succeed(configFileFound ? 'Config loaded' : 'Config loaded (defaults)')

  build_registry_home(spinner, { configFileFound, extensions: config.extensions })

  const frameworkKey = resolveFrameworkKey(config.framework)
  const outputPaths = getFrameworkOutputPaths(frameworkKey)
  const warnings: string[] = [...configWarnings]

  if (config.extensions.apiRoutes.enabled) {
    spinner.start('API routes...')
    const {
      routes,
      imports,
      warnings: routeWarnings,
    } = await scanApiRoutes(config.extensions.apiRoutes, outputPaths.apiRoutes)
    warnings.push(...routeWarnings)
    emitApiRoutesFile(outputPaths.apiRoutes, routes, imports)
    spinner.succeed('API routes done')
  } else {
    spinner.info('API routes disabled')
  }

  if (config.extensions.messages.enabled) {
    spinner.start('Messages...')
    const messageResult = await scanDuckgenMessages(config.extensions.messages)
    emitDuckgenMessagesFile(outputPaths.messages, messageResult.messages)
    spinner.succeed('Messages done')
    warnings.push(...messageResult.warnings)
  } else {
    spinner.info('Messages disabled')
  }

  emitFrameworkIndex(outputPaths)
  emitGeneratedIndex()

  if (warnings.length) {
    console.log(chalk.yellow.bold('\nWarnings:'))
    for (const w of warnings) console.log(chalk.yellow(`- ${w}`))
  } else {
    console.log(chalk.green.bold('\nNo warnings.'))
  }
}

run().catch((error) => {
  spinner.fail('Duck Gen failed.')
  console.error(chalk.red(error instanceof Error ? error.message : String(error)))
  process.exit(1)
})

function emitFrameworkIndex(outputPaths: { apiRoutes: string; messages: string; index: string }): void {
  const dir = path.dirname(outputPaths.index)
  const exports: string[] = []

  const candidates = [outputPaths.apiRoutes, outputPaths.messages]
  for (const entry of candidates) {
    if (!fs.existsSync(entry)) continue
    exports.push(`export * from './${path.basename(entry, '.d.ts')}'`)
  }

  if (!exports.length) exports.push('export {}')

  const out = ['// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.', '', ...exports, ''].join('\n')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(outputPaths.index, out, 'utf8')
}

function emitGeneratedIndex(): void {
  const outPath = getGeneratedIndexPath()
  const exports: string[] = []

  for (const framework of SUPPORTED_FRAMEWORKS) {
    const frameworkIndex = getFrameworkOutputPaths(framework).index
    if (!fs.existsSync(frameworkIndex)) continue
    exports.push(`export * from './${framework}'`)
  }

  if (!exports.length) exports.push('export {}')

  const out = ['// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.', '', ...exports, ''].join('\n')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, out, 'utf8')
}
