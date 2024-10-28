import path from 'path'
import { init_options_schema, InitOptions } from './init.dto'
import {
  fetch_registry_url,
  get_project_config,
  get_registry_base_color,
  get_registry_index,
  get_registry_item,
  logger,
  pref_light_tailwindcss,
  pref_light_typescript,
  registry_index_schema
} from '@/src/utils'

export async function init_command_action(opt: InitOptions) {
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  logger.info({ args: ['Checking for preflight...'] })

  await pref_light_typescript(cwd)
  await pref_light_tailwindcss(cwd)
  const config = await get_project_config(cwd)

  logger.success({ with_icon: true, args: [, 'Done.!, preflight passed'] })

  // console.log(config)

  // const registry = await get_registry_index()
  const registry = await get_registry_item('button', 'default')
  // const registry = await get_registry_base_color()

  console.log(registry)

  // logger.info({ args: ['Done.!'] })
}
