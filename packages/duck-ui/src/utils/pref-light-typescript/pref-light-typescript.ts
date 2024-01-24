import prompts from 'prompts'
import { highlighter, logger } from '../text-styling'
import {
  checkTypeScriptInstalled as check_typescript_installed,
  check_config_exist,
  install_typescript,
} from './pref-light-typescript.lib'
import { typescript_prompts } from './pref-light-typescript.constants'
import { pref_light_typescript_options_schema } from './pref-light-typescript.dto'

export async function pref_light_typescript(cwd: string): Promise<void> {
  const is_configured = await check_config_exist(cwd)
  const is_ts_installed = await check_typescript_installed(cwd)

  if (is_ts_installed || is_configured) return

  logger.warn({
    args: [
      `${highlighter.info('TypeScript')} is not installed. You need to install ${highlighter.info('TypeScript')}...`,
    ],
  })

  const options = await prompts(typescript_prompts)
  const { typescript } = pref_light_typescript_options_schema.parse(options)
  if (!typescript) return

  await install_typescript(cwd, typescript)
}
