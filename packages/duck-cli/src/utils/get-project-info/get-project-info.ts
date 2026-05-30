import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import type { PackageJson } from 'type-fest'
import { ZodError } from 'zod'
import { duckUiSchema } from '../preflight-configs/preflight-duckui'
import { highlighter, logger } from '../text-styling'
import { findDuckuiRootCwd } from '../workspace'
import { IGNORED_DIRECTORIES } from './get-project-info.constants'
import { tsConfigSchema } from './get-project-info.dto'

export function getPackageJson(): PackageJson | null {
  const files = fg.sync(['package.json'], {
    cwd: process.cwd(),
    deep: 1,
    ignore: IGNORED_DIRECTORIES,
  })

  if (!files.length) {
    logger.error({ args: ['package.json not found'] })
    process.exit(1)
  }

  const packageJsonPath = path.join(process.cwd(), 'package.json')

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as PackageJson

  return packageJson
}

export async function getDuckuiConfig(cwd: string, spinner: Ora) {
  try {
    spinner.text = `Getting ${highlighter.info('duckui')} configs...`

    const configRoot = findDuckuiRootCwd(cwd)
    if (!configRoot) {
      spinner.fail(
        `No ${highlighter.info('duckui')} configs found \nPlease run ${highlighter.info('@gentleduck/cli init')} to create one\nNotice you gonna add your package manager executer\ncommand at the beginning or the CLI command!\nLike ${highlighter.info('bunx @gentleduck/cli init')}\nIf you need any info run the help command,\nHaving issues?   ${highlighter.info('https://github.com/gentleeduck/gentleduck/issues')}.`,
      )
      process.exit(1)
    }

    const duckuiConfigRaw = await fs.readFile(path.join(configRoot, 'duck-ui.config.json'), 'utf8')

    let duckuiConfig: unknown
    try {
      duckuiConfig = JSON.parse(duckuiConfigRaw)
    } catch {
      spinner.fail(`${highlighter.info('duck-ui.config.json')} is not valid JSON. Fix the file and try again.`)
      process.exit(1)
    }
    const duckuiParsedConfig = duckUiSchema.safeParse(duckuiConfig)
    if (duckuiParsedConfig.error) {
      const isLegacyConfig = duckuiParsedConfig.error.issues.some(
        (issue) => issue.path[0] === 'workspace' && issue.code === 'invalid_type',
      )

      if (isLegacyConfig) {
        spinner.fail(
          `Legacy ${highlighter.info('duck-ui.config.json')} detected (missing ${highlighter.info(
            'workspace',
          )}). Re-run ${highlighter.info('@gentleduck/cli init')} to migrate.`,
        )
        process.exit(1)
      }

      spinner.stop()
      console.dir(duckuiParsedConfig.error, { depth: null })
      spinner.fail(`${highlighter.info('duckui')} invalid configs found`)
      process.exit(1)
    }

    return duckuiParsedConfig.data
  } catch (error) {
    if (error instanceof ZodError) {
      spinner.fail(`Failed to get ${highlighter.info('duckui')} configs: ${error.message}`)
    } else {
      spinner.fail(`Failed to get ${highlighter.info('duckui')} configs: ${error}`)
    }

    process.exit(1)
  }
}

export async function getTsConfig(cwd: string, spinner: Ora) {
  try {
    spinner.text = `Getting ${highlighter.info('ts')} configs...`

    const files = fg.sync(['tsconfig.json'], {
      cwd,
      deep: 1,
      ignore: IGNORED_DIRECTORIES,
    })

    if (!files.length) {
      spinner.fail(`No ${highlighter.info('ts')} configs found`)
      process.exit(1)
    }

    const tsConfigRaw = await fs.readFile(path.join(cwd, 'tsconfig.json'), 'utf8')

    const tsConfig = tsConfigSchema.parse(JSON.parse(tsConfigRaw))

    return tsConfig
  } catch (error) {
    spinner.fail(`Failed to get ${highlighter.info('ts')} configs: ${error}`)
    process.exit(1)
  }
}
