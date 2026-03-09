import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import { launch_merge_gui_and_wait } from '~/gui'
import { diff_component } from '~/services/component.service'
import { build_component_merge_state } from '~/services/merge.service'
import { get_package_manager } from '../get-package-manager'
import { get_ts_config } from '../get-project-info'
import { get_registry_item, type Registry } from '../get-registry'
import type { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import { resolve_project_cwd, validate_workspace_target } from '../workspace'
import type { DependenciesType, InstallOptions } from './registry-mutation.types'

export async function get_installation_config(
  duck_config: DuckUI,
  spinner: Ora,
  options: InstallOptions,
): Promise<string> {
  try {
    const alias = duck_config.aliases.ui.split('/').shift()
    const project_cwd = resolve_project_cwd(options.cwd, duck_config, options.workspace)
    const workspace_error = validate_workspace_target(project_cwd, true)
    if (workspace_error) {
      spinner.fail(workspace_error)
      process.exit(1)
    }
    const ts_config = await get_ts_config(project_cwd, spinner)

    if (!ts_config.compilerOptions?.paths || !alias) {
      spinner.fail(
        `No ${highlighter.info(
          'TypeScript',
        )} configs found \r\n(NOTE: check your tsconfig.json, and add the paths because we need them) \r\nAs an example \r\n${highlighter.warn(
          `paths: {\r\n  "~/*": ["./*"]\r\n}`,
        )}\r\n`,
      )
      process.exit(1)
    }

    const write_path_key = Object.keys(ts_config.compilerOptions.paths).find((path) => path.includes(alias))

    const path_values = write_path_key ? ts_config.compilerOptions.paths[write_path_key] : undefined
    const write_path = path_values?.[0]?.split('/').slice(0, -1).join('/')

    if (!write_path) {
      spinner.fail(`Alias "${alias}" not found in tsconfig paths.
Make sure your ${highlighter.info('duck-ui.config.json')} and ${highlighter.info('tsconfig.json')} aliases match.`)
      process.exit(1)
    }

    // Resolve the write_path to an absolute path using the target cwd
    const resolved_write_path = path.resolve(project_cwd, write_path)

    if (!options.yes) {
      spinner.stop()
      const { yes } = await prompts({
        initial: options.yes,
        message: `Do you want to install ${highlighter.info('components')}? at ${highlighter.warn(
          write_path,
        )} (workspace: ${highlighter.info(project_cwd)})`,
        name: 'yes',
        type: 'confirm',
      })
      spinner.start()

      if (!yes) {
        spinner.fail('Why you cannot install components?, goodbye!')
        spinner.info(
          `Having issues you can report them here: ${highlighter.info(
            'https://github.com/gentleeduck/duck-ui/issues',
          )}`,
        )
        spinner.info(
          `If you do not know how to write a professional issue,\n     you can find more info here: https://ui.gentleduck.org/docs/cli`,
        )
        process.exit(0)
      }
    }

    return resolved_write_path
  } catch (error) {
    spinner.fail(`Oops: ${highlighter.error(error instanceof Error ? error.message : String(error))}`)

    process.exit(1)
  }
}

export async function process_components(
  duck_config: DuckUI,
  components: Registry,
  write_path: string,
  spinner: Ora,
  options: InstallOptions,
) {
  try {
    const dependencies = {
      dependencies: [],
      dev_dependencies: [],
      registry_dependencies: [],
    } as DependenciesType

    const skip_prompts = options.force || options.yes

    for (const [idx, component] of components.entries()) {
      await install_component(
        duck_config,
        dependencies,
        idx,
        component,
        false,
        components,
        write_path,
        spinner,
        skip_prompts,
      )
    }

    const topLevelNames = new Set(components.map((c) => c.name.toLowerCase()))
    await install_registry_dependencies(dependencies, spinner, write_path, skip_prompts, duck_config, topLevelNames)
    const project_cwd = resolve_project_cwd(options.cwd, duck_config, options.workspace)
    const workspace_error = validate_workspace_target(project_cwd, false)
    if (workspace_error) {
      spinner.fail(workspace_error)
      process.exit(1)
    }
    await process_component_dependencies(dependencies, spinner, project_cwd)
  } catch (error) {
    spinner.fail(
      `Failed to install components, ${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    throw error
  }
}

async function install_component(
  duck_config: DuckUI,
  dependencies: DependenciesType,
  idx: number,
  component: Registry[number],
  registry: boolean,
  components: Registry,
  write_path: string,
  spinner: Ora,
  force: boolean,
) {
  dependencies.dependencies.push(...(component.dependencies ?? []))
  dependencies.dev_dependencies.push(...(component.devDependencies ?? []))
  dependencies.registry_dependencies.push(...(component.registryDependencies ?? []))

  spinner.text = `Installing ${registry ? 'necessary ' : ''}component: ${highlighter.info(`${component.name}`)}`

  const component_type = component.type.split(':').pop() as string
  const duckui_write_path = duck_config.aliases.ui.split('/').slice(1).join('/')
  const write_type_path = path.resolve(`${write_path}/${duckui_write_path}`)

  if (!fs.existsSync(write_type_path)) {
    spinner.text = `Creating directory: ${component_type}`
    await fs.mkdir(write_type_path, { recursive: true })
    spinner.succeed(`Created directory: ${component_type}`)
  }

  const write_component_path = `${write_type_path}/${component.root_folder}`

  if (!fs.existsSync(write_component_path)) {
    spinner.text = `Creating directory: ${component.root_folder}`
    await fs.mkdir(write_component_path, { recursive: true })
    spinner.succeed(`Created directory: ${component.root_folder}`)
  }

  await process_component_files(component, write_type_path, `${write_path}/${duckui_write_path}`, spinner, force)

  spinner.succeed(
    `Installed ${registry ? 'necessary ' : ''}component${
      components.length > 1 ? 's' : ''
    }: ${highlighter.info(`[${idx + 1}/${components.length}]`)}\x1b[0K`,
  )
}

export async function install_registry_dependencies(
  dependencies: DependenciesType,
  spinner: Ora,
  write_path: string,
  force: boolean,
  duck_config: DuckUI,
  exclude?: Set<string>,
) {
  const visited = new Set<string>(exclude) // avoid infinite loops and double-installs
  const allComponents: Registry = []

  async function fetchAndProcess(deps: Set<string>) {
    if (deps.size === 0) return

    const components = (
      await Promise.all(
        Array.from(deps).map(async (item, idx) => {
          spinner.text = `Fetching registry necessary dependency ${highlighter.info(
            `[${idx + 1}/${deps.size}]`,
          )} ${highlighter.warn(item)}`
          return await get_registry_item(item)
        }),
      )
    ).filter((item): item is Registry[number] => item !== null)

    spinner.succeed(`Fetched ${components.length} necessary component${components.length > 1 ? 's' : ''} from registry`)

    // Merge fetched components
    allComponents.push(...components)

    // Collect new registry dependencies
    const newDeps = new Set<string>()
    for (const comp of components) {
      for (const dep of comp.registryDependencies ?? []) {
        const lower = dep.toLowerCase()
        if (!visited.has(lower)) {
          visited.add(lower)
          newDeps.add(lower)
        }
      }
    }

    // Recurse if we found new dependencies
    if (newDeps.size > 0) {
      await fetchAndProcess(newDeps)
    }
  }

  // Kick off recursion with initial registry deps, filtering out already-visited names
  const initialDeps = new Set<string>()
  for (const d of dependencies.registry_dependencies.map((dep) => dep.toLowerCase())) {
    if (!visited.has(d)) {
      visited.add(d)
      initialDeps.add(d)
    }
  }
  await fetchAndProcess(initialDeps)

  // Install all collected components
  for (const [index, component] of allComponents.entries()) {
    await install_component(
      duck_config,
      dependencies,
      index,
      component,
      true,
      allComponents,
      write_path,
      spinner,
      force,
    )
  }
}

export async function process_component_files(
  component: Registry[0],
  write_path: string,
  from_root_write_path: string,
  spinner: Ora,
  force: boolean,
) {
  if (!component.files?.length) {
    spinner.warn(`No files found for component: ${from_root_write_path}`)
    return
  }

  if (!force) {
    if (fs.readdirSync(`${write_path}/${component.root_folder}`).length > 0) {
      spinner.stop()
      const { action } = await prompts({
        message: `${highlighter.info(component.name)} already exists. What do you want to do?`,
        name: 'action',
        type: 'select',
        choices: [
          { title: 'Overwrite (replace with registry version)', value: 'overwrite' },
          { title: 'Skip (keep local version)', value: 'skip' },
          { title: 'Merge (resolve changes interactively)', value: 'merge' },
        ],
      })
      spinner.start()

      if (action === 'skip' || !action) {
        spinner.warn(
          `Components already exists: ${highlighter.info(`${from_root_write_path}${component.root_folder}`)} (skipping)`,
        )
        return
      }

      if (action === 'merge') {
        spinner.text = `Preparing merge for ${highlighter.info(component.name)}...`

        // Build the diff between local and registry
        const local_path = `${write_path}/${component.root_folder}`
        const installed_comp = {
          name: component.name,
          root_folder: component.root_folder,
          local_path,
          registry_entry: component,
        }
        const diff_result = await diff_component(installed_comp, component)

        if (!diff_result.ok) {
          spinner.fail(`Failed to compute diff: ${diff_result.error}`)
          return
        }

        if (diff_result.data.is_identical) {
          spinner.info(`${highlighter.info(component.name)} is identical to registry. Skipping.`)
          return
        }

        // Build merge state and launch interactive merge
        const merge_state = build_component_merge_state(diff_result.data, write_path, component.root_folder)
        spinner.stop()

        const merge_results = await launch_merge_gui_and_wait(merge_state)
        spinner.start()

        if (!merge_results) {
          spinner.warn(`Merge aborted for ${highlighter.info(component.name)}.`)
          return
        }

        spinner.succeed(`Merge complete for ${highlighter.info(component.name)}.`)
        return
      }
      // action === 'overwrite' -- fall through to write files below
    }
  }

  for (const file of component.files) {
    try {
      if (!file.content) {
        spinner.warn(`Skipping file with no content: ${file.path}`)
        continue
      }
      spinner.text = `Writing file: ${file.target}`
      const target_path = path.resolve(`${write_path}`, file.path as string)
      await fs.ensureDir(path.dirname(target_path))
      await fs.writeFile(target_path, file.content, 'utf8')
      spinner.succeed(`Successfully wrote: ${from_root_write_path}/${file.path}`)
    } catch (error) {
      spinner.fail(`Failed to write file: ${file.target}`)
      throw error
    }
  }
}

export async function process_component_dependencies(
  { dependencies, dev_dependencies }: DependenciesType,
  spinner: Ora,
  cwd: string,
) {
  try {
    spinner.start(`Installing dependencies`)

    // Deduplicate all collected dependencies
    const allDependencies = [...new Set([...dependencies, ...dev_dependencies])]

    if (allDependencies.length === 0) {
      spinner.warn(`No dependencies found`)
      return
    }

    spinner.text = `Installing ${highlighter.info(String(allDependencies.length))} dependencies...`

    const packageManager = await get_package_manager(cwd)
    const result = await execa(packageManager, [packageManager !== 'npm' ? 'add' : 'install', ...allDependencies], {
      cwd,
      reject: false,
    })
    if (result.failed) {
      const stderr = result.stderr?.trim()
      spinner.fail('Failed to install dependencies')
      throw new Error(
        `${packageManager} ${packageManager !== 'npm' ? 'add' : 'install'} failed${stderr ? `:\n${stderr}` : ''}`,
      )
    }

    spinner.succeed(`Successfully installed dependencies`)
  } catch (error) {
    spinner.fail(`Failed to install dependencies`)
    throw error
  }
}
