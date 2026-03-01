import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import type { PackageJson } from 'type-fest'
import { ZodError } from 'zod'
import { duck_ui_schema } from '../preflight-configs/preflight-duckui'
import { highlighter, logger } from '../text-styling'
import { find_duckui_root_cwd } from '../workspace'
import { IGNORED_DIRECTORIES } from './get-project-info.constants'
import { ts_config_schema } from './get-project-info.dto'

// Get package.json
export function get_package_json(): PackageJson | null {
  const files = fg.sync(['package.json'], {
    cwd: process.cwd(),
    deep: 1,
    ignore: IGNORED_DIRECTORIES,
  })

  if (!files.length) {
    logger.error({ args: ['package.json not found'] })
    return process.exit(1)
  }

  const package_json_path = path.join(process.cwd(), 'package.json')

  const package_json: PackageJson = JSON.parse(fs.readFileSync(package_json_path, 'utf8'))

  return package_json
}

export async function get_duckui_config(cwd: string, spinner: Ora) {
  try {
    spinner.text = `Getting ${highlighter.info('duckui')} configs...`

    const config_root = find_duckui_root_cwd(cwd)
    if (!config_root) {
      spinner.fail(
        `No ${highlighter.info('duckui')} configs found \nPlease run ${highlighter.info('@gentleduck/cli init')} to create one\nNotice you gonna add your package manager executer\ncommand at the beginning or the CLI command!\nLike ${highlighter.info('bunx @gentleduck/cli init')}\nIf you need any info run the help command,\nHaving issues?   ${highlighter.info('https://github.com/gentleeduck/duck-ui/issues')}.`,
      )
      process.exit(1)
    }

    const duckui_config_raw = await fs.readFile(path.join(config_root, 'duck-ui.config.json'), 'utf8')

    const duckui_config = JSON.parse(duckui_config_raw) // Ensure JSON parsing
    const duckui_parsed_config = duck_ui_schema.safeParse(duckui_config)
    if (duckui_parsed_config.error) {
      const is_legacy_config = duckui_parsed_config.error.issues.some(
        (issue) => issue.path[0] === 'workspace' && issue.code === 'invalid_type',
      )

      if (is_legacy_config) {
        spinner.fail(
          `Legacy ${highlighter.info('duck-ui.config.json')} detected (missing ${highlighter.info(
            'workspace',
          )}). Re-run ${highlighter.info('@gentleduck/cli init')} to migrate.`,
        )
        process.exit(1)
      }

      spinner.stop()
      console.dir(duckui_parsed_config.error, { depth: null })
      spinner.fail(`${highlighter.info('duckui')} invalid configs found`)
      process.exit(1)
    }

    return duckui_parsed_config.data
  } catch (error) {
    if (error instanceof ZodError) {
      spinner.fail(`Failed to get ${highlighter.info('duckui')} configs: ${error.message}`)
    } else {
      spinner.fail(`Failed to get ${highlighter.info('duckui')} configs: ${error}`)
    }

    process.exit(1)
  }
}

export async function get_ts_config(cwd: string, spinner: Ora) {
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

    const ts_config_raw = await fs.readFile(path.join(cwd, 'tsconfig.json'), 'utf8')

    // Then unwrap the optional/nullable layers to access the inner object
    const ts_config = ts_config_schema.parse(JSON.parse(ts_config_raw))

    return ts_config
  } catch (error) {
    spinner.fail(`Failed to get ${highlighter.info('ts')} configs: ${error}`)
    process.exit(1)
  }
}
