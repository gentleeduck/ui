import { highlighter } from '../text-styling'
import { Ora } from 'ora'
import { get_project_type } from '../get-project-type'
import { preflight_typescript } from './preflight-typescript'
import { preflight_duckui } from './preflight-duckui'

export type PrefLightTypescriptOptions = {
  cwd: string
  spinner: Ora
}

export async function preflight_configs({
  cwd,
  spinner,
}: PrefLightTypescriptOptions): Promise<void> {
  spinner.text = `${highlighter.info('Preflighting required configs...')}`
  await preflight_typescript(cwd, spinner)
  await preflight_duckui(cwd, spinner)

  //
  // console.log(is_configured, is_ts_installed)
  // if (is_ts_installed || is_configured) return
  //
  // logger.warn({
  //   args: [
  //     `${highlighter.info('TypeScript')} is not installed. You need to install ${highlighter.info('TypeScript')}...`,
  //   ],
  // })
  //
  // const { typescript } = pref_light_typescript_options_schema.parse(options)
  // if (!typescript) return
  //
  // await install_typescript(cwd, typescript)
}
