import path from 'path'
import { init_options_schema, InitOptions } from './init.dto'
import {
  checkTailwindCssInstalled,
  checkTypeScriptInstalled,
  get_project_config
} from '@/src/utils'
import { spinner } from '@/src/utils/spinner'
import { REGISTRY_URL } from '@/src/main'

export async function init_command_action(opt: InitOptions) {
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  await checkTailwindCssInstalled(cwd)
  const config = await get_project_config(cwd)

  console.log(config)
}

export async function init_command() {}
function isUrl(path: string) {
  try {
    new URL(path)
    return true
  } catch (error) {
    return false
  }
}

function getRegistryUrl(path: string) {
  if (isUrl(path)) {
    // If the url contains /chat/b/, we assume it's the v0 registry.
    //NOTE: We need to add the /json suffix if it's missing.
    const url = new URL(path)
    if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith('/json')) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  return `${REGISTRY_URL}/${path}`
}
