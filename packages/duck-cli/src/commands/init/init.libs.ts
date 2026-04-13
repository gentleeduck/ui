import path from 'node:path'
import prompts from 'prompts'
import { get_duckui_config, registry_component_install } from '~/utils'
import { print_banner } from '~/utils/banner'
import { get_registry_index } from '~/utils/get-registry'
import { preflight_configs } from '~/utils/preflight-configs'
import { resolve_components } from '~/utils/resolve-components'
import { spinner as Spinner } from '~/utils/spinner'
import { scaffold_template } from '~/utils/template-scaffold'
import { is_verbose } from '~/utils/verbose'
import { resolve_project_cwd, validate_workspace_target } from '~/utils/workspace'
import { type InitOptions, init_arguments_schema, init_options_schema } from './init.dto'

export async function init_command_action(args: string[], opt: InitOptions) {
  const options = init_options_schema.parse(opt)
  const component_names = init_arguments_schema.parse(args)

  print_banner()
  const spinner = Spinner('Initializing...').start()
  try {
    const cwd = path.resolve(options.cwd)

    if (options.template) {
      await scaffold_template({ template: options.template, cwd, yes: options.yes }, spinner)
      spinner.succeed(`Template ${options.template} scaffolded successfully.`)
      process.exit(0)
    }

    const components_names = component_names

    const { workspace_cwd } = await preflight_configs({ ...options, cwd }, spinner)

    if (components_names.length === 0 && !options.all) {
      if (options.yes) {
        // Non-interactive mode with no components specified and no --all: skip component install
        spinner.succeed('Done.')
        process.exit(0)
      }

      spinner.stop()
      const install = await prompts({
        initial: true,
        message: 'Do you want to install components?',
        name: 'install',
        type: 'confirm',
      })

      if (!install.install) {
        spinner.succeed('Done.')
        process.exit(0)
      }
      spinner.start()
    }

    let final_names = components_names

    if (options.all && components_names.length === 0) {
      spinner.text = 'Fetching all components from registry...'
      const index = await get_registry_index()
      if (index) {
        final_names = index.filter((c) => c.type === 'registry:ui').map((c) => c.name)
      }
    }

    const components = await resolve_components(final_names, spinner)

    const duckui_config = await get_duckui_config(workspace_cwd, spinner)
    const project_cwd = resolve_project_cwd(workspace_cwd, duckui_config)
    const workspace_error = validate_workspace_target(project_cwd, true)
    if (workspace_error) {
      spinner.fail(workspace_error)
      process.exit(1)
    }

    spinner.info(`Installing components into: ${project_cwd}`)

    await registry_component_install(
      components,
      duckui_config,
      { cwd: workspace_cwd, yes: options.yes, force: false },
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
