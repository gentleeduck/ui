import path from 'node:path'
import { print_banner } from '~/utils/banner'
import { get_duckui_config } from '~/utils/get-project-info'
import { get_registry_index } from '~/utils/get-registry'
import { registry_component_install } from '~/utils/registry-mutation'
import { resolve_components } from '~/utils/resolve-components'
import { spinner as Spinner } from '~/utils/spinner'
import { is_verbose } from '~/utils/verbose'
import { resolve_project_cwd, validate_workspace_target } from '~/utils/workspace'
import { add_arguments_schema, add_options_schema, type addOptions } from './add.dto'

export async function add_command_action(args: string[], opt: addOptions) {
  const options = add_options_schema.parse(opt)
  const component_names = add_arguments_schema.parse(args)

  print_banner()
  const spinner = Spinner('initializing...').start()
  try {
    const cwd = path.resolve(options.cwd)

    let components_names = component_names

    if (options.all && components_names.length === 0) {
      spinner.text = 'Fetching all components from registry...'
      const index = await get_registry_index()
      if (index) {
        components_names = index.filter((c) => c.type === 'registry:ui').map((c) => c.name)
      }
    }

    const components = await resolve_components(components_names, spinner)

    // In monorepo mode, config lives in the workspace directory
    const config_cwd = options.workspace ? path.resolve(cwd, options.workspace) : cwd
    const duckui_config = await get_duckui_config(config_cwd, spinner)
    const project_cwd = resolve_project_cwd(config_cwd, duckui_config)
    const workspace_error = validate_workspace_target(project_cwd, true)
    if (workspace_error) {
      spinner.fail(workspace_error)
      process.exit(1)
    }

    spinner.info(`Using workspace: ${project_cwd}`)

    await registry_component_install(
      components,
      duckui_config,
      { ...options, cwd: config_cwd, workspace: undefined },
      spinner,
    )

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
