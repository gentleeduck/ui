import path from 'node:path'
import prompts from 'prompts'
import { get_duckui_config, registry_component_install } from '~/utils'
import { preflight_configs } from '~/utils/preflight-configs'
import { resolve_components } from '~/utils/resolve-components'
import { spinner as Spinner } from '~/utils/spinner'
import { is_verbose } from '~/utils/verbose'
import { type InitOptions, init_arguments_schema, init_options_schema } from './init.dto'

export async function init_command_action(args: string[], opt: InitOptions) {
  const spinner = Spinner('Initializing...').start()
  try {
    const options = init_options_schema.parse(opt)
    const cwd = path.resolve(options.cwd)

    const components_names = init_arguments_schema.parse(args)

    await preflight_configs({ ...options, cwd }, spinner)

    if (components_names.length === 0) {
      spinner.stop()
      const install = await prompts({
        initial: true,
        message: 'Do you want to install components?',
        name: 'install',
        type: 'confirm',
      })

      if (!install.install) {
        spinner.succeed('Done.!, enjoy mr duck!')
        process.exit(0)
      }
      spinner.start()
    }

    const components = await resolve_components(components_names, spinner)

    const duckui_config = await get_duckui_config(cwd, spinner)

    await registry_component_install(components, duckui_config, { yes: options.yes, force: false }, spinner)

    spinner.succeed('Done.!, enjoy mr duck!')
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : error}`)
    if (is_verbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
