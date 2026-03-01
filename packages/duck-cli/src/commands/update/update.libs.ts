import path from 'node:path'
import prompts from 'prompts'
import { resolve_write_type_path, scan_installed_components } from '~/services/component.service'
import { install_components, install_npm_deps, resolve_install_path } from '~/services/install.service'
import { print_banner } from '~/utils/banner'
import { get_duckui_config, get_ts_config } from '~/utils/get-project-info'
import { get_registry_item } from '~/utils/get-registry'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { is_verbose } from '~/utils/verbose'
import { type UpdateOptions, update_arguments_schema, update_options_schema } from './update.dto'

export async function update_command_action(args: string[], opt: UpdateOptions) {
  const options = update_options_schema.parse(opt)
  const component_names = update_arguments_schema.parse(args)

  print_banner()
  const spinner = Spinner('initializing...').start()
  try {
    const cwd = path.resolve(options.cwd)

    const duckui_config = await get_duckui_config(cwd, spinner)
    const ts_config = await get_ts_config(cwd, spinner)

    const path_result = resolve_install_path(duckui_config, ts_config)
    if (!path_result.ok) {
      spinner.fail(path_result.error)
      process.exit(1)
    }

    const write_type_path = resolve_write_type_path(duckui_config, path.resolve(cwd, path_result.data))

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

    if (options.all) {
      // Update everything
    } else if (component_names.length === 0) {
      spinner.stop()
      const { picked } = await prompts({
        type: 'autocompleteMultiselect',
        name: 'picked',
        message: 'Select components to update',
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
      console.log(`\nComponents to update:`)
      for (const c of selected) {
        console.log(`  ${highlighter.info(c.name)}`)
      }
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Update ${selected.length} component${selected.length > 1 ? 's' : ''} from registry?`,
        initial: true,
      })
      spinner.start()

      if (!confirm) {
        spinner.info('Aborted.')
        process.exit(0)
      }
    }

    // Fetch latest versions from registry
    spinner.text = 'Fetching latest versions from registry...'
    const registry_entries = []
    for (const comp of selected) {
      const entry = await get_registry_item(comp.name)
      if (entry) {
        registry_entries.push(entry)
      } else {
        spinner.warn(`Component "${comp.name}" not found in registry, skipping.`)
      }
    }

    if (registry_entries.length === 0) {
      spinner.fail('No components could be fetched from registry.')
      process.exit(1)
    }

    // Re-install with force (update = forced re-install)
    const install_result = await install_components(
      registry_entries,
      duckui_config,
      path.resolve(cwd, path_result.data),
      true,
      (msg) => {
        spinner.text = msg
      },
    )

    if (!install_result.ok) {
      spinner.fail(install_result.error)
      process.exit(1)
    }

    // Install any new/updated npm dependencies
    const deps_result = await install_npm_deps(
      install_result.data.dependencies,
      install_result.data.devDependencies,
      cwd,
      (msg) => {
        spinner.text = msg
      },
    )

    if (!deps_result.ok) {
      spinner.fail(deps_result.error)
      process.exit(1)
    }

    spinner.succeed(`Updated ${registry_entries.length} component${registry_entries.length > 1 ? 's' : ''}.`)
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (is_verbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
