import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { type PackageJson } from 'type-fest'
import { highlighter, logger } from '../text-styling'
import { IGNORED_DIRECTORIES } from './get-project-info.constants'
import { Ora } from 'ora'
import { duck_ui_schema } from '../preflight-configs/preflight-duckui'
import { ZodError } from 'zod'
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
    spinner.text = `🦆 Getting ${highlighter.info('duckui')} configs...`

    const files = fg.sync(['duck-ui.config.json'], {
      cwd,
      deep: 1,
      ignore: IGNORED_DIRECTORIES,
    })

    if (!files.length) {
      spinner.fail(
        `🦆 No ${highlighter.info('duckui')} configs found \n🦆 Please run ${highlighter.info('@gentleduck/duck-ui init')} to create one\n🦆 Notice you gonna add your package manager executer\n🦆 command at the beginning or the CLI command!\n🦆 Like ${highlighter.info('pnpm dlx @gentleduck/duck-ui init')}\n🦆 If you need any info run the help command,\n🦆 Having issues?   ${highlighter.info('https://github.com/gentleeduck/duck-ui/issues')}.`,
      )
      process.exit(1)
    }

    const duckui_config_raw = await fs.readFile(path.join(cwd, 'duck-ui.config.json'), 'utf8')

    const duckui_config = JSON.parse(duckui_config_raw) // Ensure JSON parsing
    const duckui_parsed_config = duck_ui_schema.parse(duckui_config)

    return duckui_parsed_config
  } catch (error) {
    if (error instanceof ZodError) {
      spinner.fail(`🦆 Failed to get ${highlighter.info('duckui')} configs: ${error.message}`)
    } else {
      spinner.fail(`🦆 Failed to get ${highlighter.info('duckui')} configs: ${error}`)
    }

    process.exit(1)
  }
}

export async function get_ts_config(cwd: string, spinner: Ora) {
  try {
    spinner.text = `🦆 Getting ${highlighter.info('ts')} configs...`

    const files = fg.sync(['tsconfig.json'], {
      cwd,
      deep: 1,
      ignore: IGNORED_DIRECTORIES,
    })

    if (!files.length) {
      spinner.fail(`🦆 No ${highlighter.info('ts')} configs found`)
      process.exit(1)
    }

    const ts_config_raw = await fs.readFile(path.join(cwd, 'tsconfig.json'), 'utf8')

    // Then unwrap the optional/nullable layers to access the inner object
    const ts_config = ts_config_schema.parse(JSON.parse(ts_config_raw))

    return ts_config
  } catch (error) {
    spinner.fail(`🦆 Failed to get ${highlighter.info('ts')} configs: ${error}`)
    process.exit(1)
  }
}
