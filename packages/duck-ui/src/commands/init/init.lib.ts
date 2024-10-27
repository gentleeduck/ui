import axios from 'axios'
import path from 'path'
import { init_options_schema, InitOptions } from './init.dto'
import {
  get_project_config,
  logger,
  pref_light_tailwindcss,
  pref_light_typescript
} from '@/src/utils'
import { REGISTRY_URL } from '@/src/main'

export async function init_command_action(opt: InitOptions) {
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  logger.info({ args: ['Checking for preflight...'] })

  await pref_light_typescript(cwd)
  await pref_light_tailwindcss(cwd)
  const config = await get_project_config(cwd)

  logger.success({ with_icon: true, args: [, 'Done.!, preflight passed'] })

  // console.log(config)

  const hi = await fetch_registry_url('')

  console.log(hi)

  // logger.info({ args: ['Done.!'] })
}

function is_url(path: string) {
  try {
    new URL(path)
    return true
  } catch (error) {
    return false
  }
}

function get_registry_url(path: string) {
  if (is_url(path)) {
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

export async function fetch_registry_url(path: string) {
  try {
    const url = get_registry_url(path)

    const res = await axios.get(url)
    const data = res.data
    return data
  } catch (error) {
    console.log(error)
  }
}
