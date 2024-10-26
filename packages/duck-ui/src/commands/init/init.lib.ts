import path from 'path'
import { init_options_schema, InitOptions } from './init.dto'
import {
    checkTypeScriptInstalled,
    get_project_config,
    get_project_type,
    install_tailwindcss,
    logger,
    pref_light_tailwindcss,
    pref_light_typescript
} from '@/src/utils'
import { REGISTRY_URL } from '@/src/main'

export async function init_command_action(opt: InitOptions) {
    const options = init_options_schema.parse(opt)
    const cwd = path.resolve(options.cwd)

    logger.info({ args: ['Checking for preflight...'] })

    await pref_light_tailwindcss(cwd)
    await pref_light_typescript(cwd)
    const config = await get_project_config(cwd)

    // const hi = getRegistryUrl('button')

    // console.log(hi)

    // const type = await get_project_type(cwd)
    // await install_tailwindcss(cwd, type, is_ts)

    // logger.info({ args: ['Done.!'] })
}

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
