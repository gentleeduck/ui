import { Ora } from 'ora'
import { ProjectTypeEnum } from '../../get-project-type'
import { default_duckui_config } from './preflight-duckui.constants'

export async function init_duckui_config(
  cwd: string,
  duckui: boolean,
  spinner: Ora,
  type: keyof typeof ProjectTypeEnum,
  is_ts: boolean,
) {
  // const config = JSON.stringify(default_duckui_config(type, is_ts, '', '~'))
  // console.log('\n\n', JSON.parse(config))
}
