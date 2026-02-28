import path from 'node:path'
import { get_duckui_config } from '~/utils/get-project-info'
import { registry_component_install } from '~/utils/registry-mutation'
import { resolve_components } from '~/utils/resolve-components'
import { spinner as Spinner } from '~/utils/spinner'
import { is_verbose } from '~/utils/verbose'
import { add_arguments_schema, add_options_schema, type addOptions } from './add.dto'

export async function add_command_action(args: string[], opt: addOptions) {
  const spinner = Spinner('initializing...').start()
  try {
    const options = add_options_schema.parse(opt)
    const cwd = path.resolve(options.cwd)

    const components_names = add_arguments_schema.parse(args)

    const components = await resolve_components(components_names, spinner)

    const duckui_config = await get_duckui_config(cwd, spinner)

    await registry_component_install(components, duckui_config, { ...options, cwd }, spinner)

    spinner.succeed('Done.')
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (is_verbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
