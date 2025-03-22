import path from 'node:path'
import { init_options_schema, InitOptions } from './init.dto'
import { preflight_configs, get_project_type } from '@/src/utils'
import { spinner as Spinner } from '@/src/utils/spinner'

export async function init_command_action(opt: InitOptions) {
  const spinner = Spinner('Initializing...').start()
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  await preflight_configs({ cwd, spinner })
  // await pref_light_tailwindcss(cwd)
  // const config = await get_project_config(cwd)

  // logger.success({ with_icon: true, args: [, 'Done.!, preflight passed'] })

  // console.log(config)

  // const registry = await get_registry_index()
  // const registry = await get_registry_item('button', 'default')
  // const registry = await get_registry_base_color()

  // console.log(registry)

  spinner.succeed('Done.!, enjoy your duck! :)')
}
