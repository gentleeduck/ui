import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { Ora } from 'ora'
import prompts from 'prompts'
import { get_package_manager } from '../get-package-manager'
import { get_ts_config } from '../get-project-info'
import { get_registry_item, Registry } from '../get-registry'
import { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import { DependenciesType } from './registry-mutation.types'

export async function get_installation_config(
  duck_config: DuckUI,
  spinner: Ora,
  default_yes: boolean,
): Promise<string> {
  try {
    const alias = duck_config.aliases.ui.split('/').shift()
    const ts_config = await get_ts_config(process.cwd(), spinner)

    if (!ts_config.compilerOptions?.paths || !alias) {
      spinner.fail(`No ${highlighter.info('ts')} configs found`)
      process.exit(1)
    }

    const write_path_key = Object.keys(ts_config.compilerOptions.paths).find((path) => path.includes(alias))

    const write_path = ts_config.compilerOptions.paths[write_path_key as string][0].split('/').slice(0, -1).join('/')

    spinner.stop()
    const { yes } = await prompts({
      type: 'confirm',
      name: 'yes',
      message: `💡  Do you want to install ${highlighter.info('components')}? at ${highlighter.warn(write_path)}`,
      initial: default_yes,
    })
    spinner.start()

    if (!yes) {
      spinner.fail('🥺 Why you cannot install components?, goodbye!')
      spinner.info(
        `🦆 Having issues you can report them here: ${highlighter.info('https://github.com/gentleduck/ui/issues')}`,
      )
      spinner.info(
        `🦆 If you do not know how to write a professional issue,\n     you can find more info here: https://ui.gentleduck.com/docs/cli`,
      )
      process.exit(0)
    }

    return write_path
  } catch (error) {
    spinner.fail(`🦆 Oops: ${highlighter.error(error as string)}`)
    process.exit(1)
  }
}

export async function process_components(components: Registry, write_path: string, spinner: Ora) {
  try {
    const dependencies = {
      dependencies: [],
      dev_dependencies: [],
      registry_dependencies: [],
    } as DependenciesType

    await Promise.all(
      components.map(async (component, idx) => {
        spinner.text = `🦆 Installing component: ${highlighter.info(`${component.name}`)}`

        const component_ype = component.type.split(':').pop()!
        const component_path = path.resolve(`${write_path}/${component_ype}/${component.root_folder}`)

        if (!fs.existsSync(component_path)) {
          spinner.text = `Creating directory: ${component_ype}/${component.root_folder}`
          await fs.mkdir(component_path, { recursive: true })
          spinner.succeed(`⚡ Created directory: ${component_ype}/${component.root_folder}`)
        }
        await process_component_files(component, write_path, component_ype, spinner)
        dependencies.dependencies.push(...(component.dependencies ?? []))
        dependencies.dev_dependencies.push(...(component.devDependencies ?? []))
        dependencies.registry_dependencies.push(...(component.registryDependencies ?? []))

        spinner.succeed(
          `🦋 Installed component${components.length > 1 ? 's' : ''}: ${highlighter.info(
            `[${idx + 1}/${components.length}]`,
          )}\x1b[0K`,
        )
      }),
    )
    await install_registry_dependencies(dependencies, spinner)
    await process_component_dependencies(dependencies, spinner)
  } catch (error) {
    spinner.fail(`🦆 Failed to install components, ${highlighter.error(error as string)}`)
    throw error
  }
}

export async function install_registry_dependencies({ registry_dependencies }: DependenciesType, spinner: Ora) {
  const components = await Promise.all(
    registry_dependencies.map(async (item, idx) => {
      spinner.text = `🦆 Fetching components... ${highlighter.info(`[${idx}/${registry_dependencies.length}]`)}`
      return await get_registry_item(item as Lowercase<string>)
    }),
  )

  if (!components.length) {
    spinner.fail('🦆 No components found')
    process.exit(0)
  }
  console.log(components)

  spinner.succeed(
    `🦋 Fetched necessary component${components.length > 1 ? 's' : ''} ${highlighter.info(`[${components.length}]`)}`,
  )
}

export async function process_component_files(
  component: Registry[0],
  write_path: string,
  component_type: string,
  spinner: Ora,
) {
  if (!component.files?.length) {
    spinner.warn(`🦆 No files found for component: ${component_type}`)
    return
  }

  for (const file of component.files) {
    const file_path = path.resolve(`${write_path}/${component_type}`, file.path)

    try {
      if (fs.existsSync(file_path)) {
        spinner.stop()
        const { overwrite } = await prompts({
          type: 'confirm',
          name: 'overwrite',
          message: `💡  Do you want to overwrite ${highlighter.info(file.path)}?`,
          initial: true,
        })
        spinner.start()

        if (!overwrite) {
          spinner.warn(`🦆 File already exists: ${file.path} (skipping)`)
          continue
        }
        process.stdout.write('\x1b[1A\x1b[2K')
      }

      spinner.text = `🦋 Writing file: ${file.target}`
      await fs.writeFile(file_path, file.content!, 'utf8')
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
    console.log(dependencies, dev_dependencies)

    if (dependencies.length === 0 && dev_dependencies.length === 0) {
      spinner.warn(`🦆 No dependencies found`)
      return
    }

    // Merge all dependencies into a single list
    const allDependencies = [...dependencies, ...dev_dependencies]

    spinner.text = `🔧 Installing ${highlighter.info(allDependencies.length)} dependencies...`

    const packageManager = await get_package_manager(process.cwd())
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
