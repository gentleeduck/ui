import fg from 'fast-glob'
import { Ora } from 'ora'
import prompts from 'prompts'
import { ProjectTypeEnum } from '../../get-project-type'
import { highlighter } from '../../text-styling'
import { IGNORED_DIRECTORIES } from '../../get-project-info'
import { preflight_duckui_options_schema } from './preflight-duckui.dto'
import {
  duckui_config_prompts,
  duckui_prompts,
} from './preflight-duckui.constants'
import { init_duckui_config } from './preflight-duckui.libs'

// Check if config exists
export async function preflight_duckui(
  cwd: string,
  spinner: Ora,
  type: keyof typeof ProjectTypeEnum,
  is_ts: boolean,
) {
  try {
    spinner.text = `${highlighter.info('Checking for duck-ui config...')}`
    const files = fg.sync(['duck-ui.config.*'], {
      cwd,
      deep: 1,
      ignore: IGNORED_DIRECTORIES,
    })

    if (files.length) {
      spinner.text = `${highlighter.info('duck-ui config found...')}`
    }

    spinner.stop()
    const options = await prompts(duckui_prompts)
    const { duckui } = preflight_duckui_options_schema.parse(options)
    spinner.start()

    if (!duckui) {
      spinner.text = `${highlighter.info('Required config not found...')}`
      process.exit(0)
    }

    spinner.text = `${highlighter.info('Initializing duck-ui config...')}`
    spinner.stop()
    const config_options = await prompts(duckui_config_prompts)
    console.log(config_options)

    spinner.start()

    await init_duckui_config(cwd, duckui, spinner, type, is_ts)

    //TODO: init the config here
  } catch (error) {
    spinner.text = `${highlighter.info('No duck-ui config found...')}${highlighter.error(error as string)}`
  }
}
