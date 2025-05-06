import { Ora } from 'ora'
import { default_duckui_config } from './preflight-duckui.constants'
import { DuckuiPrompts } from './preflight-duckui.dto'
import { highlighter } from '~/utils/text-styling'
import path from 'node:path'
import fs from 'fs-extra'

export async function init_duckui_config(cwd: string, spinner: Ora, duck_config: DuckuiPrompts) {
  try {
    spinner.text = `Initializing ${highlighter.info('duck-ui')} config...`

    spinner.text = `Writing ${highlighter.info('duck-ui')} config...`
    await fs.writeFile(path.join(cwd, 'duck-ui.config.json'), default_duckui_config(duck_config), 'utf-8')

    spinner.succeed(`${highlighter.info('duck-ui')} config initialized...`)
  } catch (error) {
    spinner.fail(
      `Failed to initialize ${highlighter.error('duck-ui config...')}\n ${highlighter.error(error as string)}`,
    )
    process.exit(0)
  }
}
