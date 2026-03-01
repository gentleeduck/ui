import path from 'node:path'
import prompts from 'prompts'
import { remove_components, resolve_write_type_path, scan_installed_components } from '~/services/component.service'
import { resolve_install_path } from '~/services/install.service'
import { print_banner } from '~/utils/banner'
import { get_duckui_config, get_ts_config } from '~/utils/get-project-info'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { is_verbose } from '~/utils/verbose'
import { resolve_project_cwd, validate_workspace_target } from '~/utils/workspace'
import { type RemoveOptions, remove_arguments_schema, remove_options_schema } from './remove.dto'

export async function remove_command_action(args: string[], opt: RemoveOptions) {
  const options = remove_options_schema.parse(opt)
  const component_names = remove_arguments_schema.parse(args)

  print_banner()
  const spinner = Spinner('initializing...').start()
  try {
    const cwd = path.resolve(options.cwd)

    const duckui_config = await get_duckui_config(cwd, spinner)
    const project_cwd = resolve_project_cwd(cwd, duckui_config, options.workspace)
    const workspace_error = validate_workspace_target(project_cwd, true)
    if (workspace_error) {
      spinner.fail(workspace_error)
      process.exit(1)
    }
    spinner.info(`Using workspace: ${project_cwd}`)
    const ts_config = await get_ts_config(project_cwd, spinner)

    const path_result = resolve_install_path(duckui_config, ts_config)
    if (!path_result.ok) {
      spinner.fail(path_result.error)
      process.exit(1)
    }

    const write_type_path = resolve_write_type_path(duckui_config, path.resolve(project_cwd, path_result.data))

    spinner.text = 'Scanning installed components...'
    const scan_result = await scan_installed_components(write_type_path)
    if (!scan_result.ok) {
      spinner.fail(scan_result.error)
      process.exit(1)
    }

    if (scan_result.data.length === 0) {
      spinner.fail('No installed components found.')
      process.exit(1)
    }

    let selected = scan_result.data

    if (component_names.length === 0) {
      spinner.stop()
      const { picked } = await prompts({
        type: 'autocompleteMultiselect',
        name: 'picked',
        message: 'Select components to remove',
        choices: scan_result.data.map((c) => ({ title: c.name, value: c.name })),
      })
      spinner.start()

      if (!picked || picked.length === 0) {
        spinner.info('No components selected.')
        process.exit(0)
      }

      selected = scan_result.data.filter((c) => picked.includes(c.name))
    } else {
      selected = scan_result.data.filter((c) => component_names.some((n) => n.toLowerCase() === c.name.toLowerCase()))

      if (selected.length === 0) {
        spinner.fail(
          `None of the specified components are installed: ${component_names.map((n) => highlighter.info(n)).join(', ')}`,
        )
        process.exit(1)
      }
    }

    if (!options.yes) {
      spinner.stop()
      console.log(`\nComponents to remove:`)
      for (const c of selected) {
        console.log(`  ${highlighter.warn(c.name)} (${c.local_path})`)
      }
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Remove ${selected.length} component${selected.length > 1 ? 's' : ''}?`,
        initial: false,
      })
      spinner.start()

      if (!confirm) {
        spinner.info('Aborted.')
        process.exit(0)
      }
    }

    const result = await remove_components(selected, (msg) => {
      spinner.text = msg
    })

    if (!result.ok) {
      spinner.fail(result.error)
      process.exit(1)
    }

    spinner.succeed(`Removed ${selected.length} component${selected.length > 1 ? 's' : ''}.`)
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (is_verbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
