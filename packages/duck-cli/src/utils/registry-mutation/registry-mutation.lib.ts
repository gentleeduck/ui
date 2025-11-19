import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import type { addOptions } from '~/commands/add'
import { get_package_manager } from '../get-package-manager'
import { get_ts_config } from '../get-project-info'
import { get_registry_item, type Registry } from '../get-registry'
import type { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import type { DependenciesType } from './registry-mutation.types'

export async function get_installation_config(duck_config: DuckUI, spinner: Ora, options: addOptions): Promise<string> {
  try {
    const alias = duck_config.aliases.ui.split('/').shift()
    const ts_config = await get_ts_config(process.cwd(), spinner)

    if (!ts_config.compilerOptions?.paths || !alias) {
      spinner.fail(
        `No ${highlighter.info(
          'TypeScript',
        )} configs found \r\n(NOTE: chekck your tsconfig.json, and add the paths because we need them) \r\nAs an example \r\n${highlighter.warn(
          `paths: {\r\n  "~/*": ["./*"]\r\n}`,
        )}\r\n`,
      )
      process.exit(1)
    }

    const write_path_key = Object.keys(ts_config.compilerOptions.paths).find((path) => path.includes(alias))

    const write_path = ts_config.compilerOptions.paths[write_path_key as string]?.[0]?.split('/').slice(0, -1).join('/')

    if (!write_path) {
      spinner.fail(`🦆 Alias "${alias}" not found in tsconfig paths.
Make sure your ${highlighter.info('duck-ui.config.json')} and ${highlighter.info('tsconfig.json')} aliases match.`)
      process.exit(1)
    }

    if (!options.yes) {
      spinner.stop()
      const { yes } = await prompts({
        initial: options.yes,
        message: `💡 Do you want to install ${highlighter.info('components')}? at ${highlighter.warn(write_path)}`,
        name: 'yes',
        type: 'confirm',
      })
      spinner.start()

      if (!yes) {
        spinner.fail('🥺 Why you cannot install components?, goodbye!')
        spinner.info(
          `🦆 Having issues you can report them here: ${highlighter.info(
            'https://github.com/gentleeduck/duck-ui/issues',
          )}`,
        )
        spinner.info(
          `🦆 If you do not know how to write a professional issue,\n     you can find more info here: https://ui.gentleduck.com/docs/cli`,
        )
        process.exit(0)
      }
    }

    return write_path
  } catch (error) {
    spinner.fail(`🦆 Oops: ${highlighter.error(error as string)}`)

    process.exit(1)
  }
}

export async function process_components(
  duck_config: DuckUI,
  components: Registry,
  write_path: string,
  spinner: Ora,
  options: addOptions,
) {
  try {
    const dependencies = {
      dependencies: [],
      dev_dependencies: [],
      registry_dependencies: [],
    } as DependenciesType

    await Promise.all(
      components.map(
        async (component, idx) =>
          await install_component(
            duck_config,
            dependencies,
            idx,
            component,
            false,
            components,
            write_path,
            spinner,
            options.force,
          ),
      ),
    )

    await install_registry_dependencies(dependencies, spinner, write_path, options.force, duck_config)
    await process_component_dependencies(dependencies, spinner)
  } catch (error) {
    spinner.fail(`🦆 Failed to install components, ${highlighter.error(error as string)}`)
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
  foce: boolean,
) {
  dependencies.dependencies.push(...(component.dependencies ?? []))
  dependencies.dev_dependencies.push(...(component.devDependencies ?? []))
  dependencies.registry_dependencies.push(...(component.registryDependencies ?? []))

  spinner.text = `🦆 Installing ${registry ? 'necessary ' : ''}component: ${highlighter.info(`${component.name}`)}`

  const component_ype = component.type.split(':').pop() as string
  const ui_path = duck_config.aliases.ui.split('/').slice(1).join('/')
  const component_path = path.resolve(`${write_path}/${ui_path}/${component_ype}/${component.root_folder}`)

  if (!fs.existsSync(ui_path)) {
    spinner.text = `Creating directory: ${ui_path}`
    await fs.mkdir(ui_path, { recursive: true })
    spinner.succeed(`⚡ Created directory: ${ui_path}`)
  }

  if (!fs.existsSync(component_path)) {
    spinner.text = `Creating directory: ${component_ype}/${component.root_folder}`
    await fs.mkdir(component_path, { recursive: true })
    spinner.succeed(`⚡ Created directory: ${component_ype}/${component.root_folder}`)
  }
  await process_component_files(component, write_path, ui_path, component_ype, spinner, foce)

  spinner.succeed(
    `🦋 Installed ${registry ? 'necessary ' : ''}component${
      components.length > 1 ? 's' : ''
    }: ${highlighter.info(`[${idx + 1}/${components.length}]`)}\x1b[0K`,
  )
}

export async function install_registry_dependencies(
  dependencies: DependenciesType,
  spinner: Ora,
  write_path: string,
  foce: boolean,
  duck_config: DuckUI,
) {
  const visited = new Set<string>() // avoid infinite loops
  const allComponents: Registry = []

  async function fetchAndProcess(deps: Set<string>) {
    if (deps.size === 0) return

    const components = (await Promise.all(
      Array.from(deps).map(async (item, idx) => {
        spinner.text = `🦆 Fetching registry necessary dependency ${highlighter.info(
          `[${idx + 1}/${deps.size}]`,
        )} ${highlighter.warn(item)}`
        return await get_registry_item(item as Lowercase<string>)
      }),
    )) as Registry

    spinner.succeed(
      `🦋 Fetched ${components.length} necessary component${components.length > 1 ? 's' : ''} from registry`,
    )

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

  // Kick off recursion with initial registry deps
  const initialDeps = new Set(dependencies.registry_dependencies.map((d) => d.toLowerCase()))
  initialDeps.forEach((d) => {
    visited.add(d)
  })
  await fetchAndProcess(initialDeps)

  // 🔑 Ensure dependencies & devDependencies are unique
  dependencies.dependencies = Array.from(new Set(dependencies.dependencies ?? []))
  dependencies.dev_dependencies = Array.from(new Set(dependencies.dev_dependencies ?? []))

  // Install all collected components
  for (let i = 0; i < allComponents.length; i++) {
    await install_component(
      duck_config,
      dependencies,
      i,
      allComponents[i],
      true,
      allComponents,
      write_path,
      spinner,
      foce,
    )
  }
}

export async function process_component_files(
  component: Registry[0],
  write_path: string,
  ui_path: string,
  component_type: string,
  spinner: Ora,
  force: boolean,
) {
  if (!component.files?.length) {
    spinner.warn(`🦆 No files found for component: ${component_type}`)
    return
  }

  const file_path = path.resolve(`${write_path}/${ui_path}/${component_type}`, component.root_folder)
  if (!force) {
    if (fs.existsSync(file_path) && fs.readdirSync(file_path).length > 0) {
      spinner.stop()
      const { overwrite } = await prompts({
        initial: true,
        message: `💡 Do you want to overwrite ${highlighter.info(component.name)}?`,
        name: 'overwrite',
        type: 'confirm',
      })
      spinner.start()
      if (!overwrite) {
        spinner.warn(
          `🦆 Components already exists: ${highlighter.info(`${component_type}${component.root_folder}`)} (skipping)`,
        )
        return
      }
    }
  }

  for (const file of component.files) {
    try {
      spinner.text = `🦋 Writing file: ${file.target}`
      await fs.writeFile(
        path.resolve(`${write_path}/${ui_path}/${component_type}`, file.path as string),
        file.content as string,
        'utf8',
      )
      spinner.succeed(`🦋 Successfully wrote: ${file.target}`)
    } catch (error) {
      spinner.fail(`🦆 Failed to write file: ${file.target}`)
      throw error
    }
  }
}

export async function process_component_dependencies(
  { dependencies, dev_dependencies }: DependenciesType,
  spinner: Ora,
) {
  try {
    spinner.start(`🦋 Installing dependencies`)

    if (dependencies.length === 0 && dev_dependencies.length === 0) {
      spinner.warn(`🦆 No dependencies found`)
      return
    }

    // Merge all dependencies into a single list
    const allDependencies = [...dependencies, ...dev_dependencies]

    spinner.text = `🔧 Installing ${highlighter.info(allDependencies.length)} dependencies...`

    const packageManager = await get_package_manager(process.cwd())
    console.log(packageManager)
    const { failed: installation_step_1 } = await execa(
      packageManager,
      [packageManager !== 'npm' ? 'add' : 'install', 'lucide-react', ...allDependencies],
      {
        cwd: process.cwd(),
        shell: true,
        stdio: 'ignore',
      },
    )
    if (installation_step_1) return spinner.fail(`${installation_step_1}`)

    spinner.succeed(`🦋 Successfully installed dependencies`)
  } catch (error) {
    spinner.fail(`🦆 Failed to install dependencies`)
    console.error(error)
  }
}
