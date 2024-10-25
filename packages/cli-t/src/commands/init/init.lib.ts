import path from 'path'
import { init_options_schema, InitOptions } from './init.dto'
import {
  checkTypeScriptInstalled,
  get_project_config,
  logger,
  pref_light_tailwindcss
} from '@/src/utils'

export async function init_command_action(opt: InitOptions) {
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  logger.info({ args: ['Checking for preflight...'] })

  const typescript = await checkTypeScriptInstalled(cwd)
  await pref_light_tailwindcss(cwd, typescript)
  const config = await get_project_config(cwd)

  console.log(config)
}

// export async function init_command() {}
// function isUrl(path: string) {
//   try {
//     new URL(path)
//     return true
//   } catch (error) {
//     return false
//   }
// }
//
// function getRegistryUrl(path: string) {
//   if (isUrl(path)) {
//     // If the url contains /chat/b/, we assume it's the v0 registry.
//     //NOTE: We need to add the /json suffix if it's missing.
//     const url = new URL(path)
//     if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith('/json')) {
//       url.pathname = `${url.pathname}/json`
//     }
//
//     return url.toString()
//   }
//
//   return `${REGISTRY_URL}/${path}`
// }
