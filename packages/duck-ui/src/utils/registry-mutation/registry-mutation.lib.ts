import { Ora } from 'ora'
import { Registry } from '../get-registry'
import { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import { get_ts_config } from '../get-project-info'
import prompts from 'prompts'
import path from 'node:path'
import fs from 'fs-extra'

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

    const write_path_key = Object.keys(ts_config.compilerOptions.paths).find(
      (path) => path.includes(alias),
    )

    const write_path = ts_config.compilerOptions.paths[
      write_path_key as string
    ][0]
      .split('/')
      .slice(0, -1)
      .join('/')

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
        `🦆 Having issues you can report them here: ${highlighter.info('https://github.com/gentelduck/ui/issues')}`,
      )
      spinner.info(
        `🦆 If you do not know how to write a professional issue,\n     you can find more info here: https://ui.gentelduck.com/docs/cli`,
      )
      process.exit(0)
    }

    return write_path
  } catch (error) {
    spinner.fail(`🦆 Oops: ${highlighter.error(error as string)}`)
    process.exit(1)
  }
}

export async function process_components(
  components: Registry,
  write_path: string,
  spinner: Ora,
) {
  try {
    await Promise.all(
      components.map(async (component, idx) => {
        spinner.text = `🦆 Installing component: ${highlighter.info(`${component.name}`)}`

        const componentType = component.type.split(':').pop()!
        const component_path = path.resolve(
          `${write_path}/${componentType}/${component.root_folder}`,
        )

        if (!fs.existsSync(component_path)) {
          spinner.text = `Creating directory: ${componentType}/${component.root_folder}`
          await fs.mkdir(component_path, { recursive: true })
          spinner.succeed(
            `⚡ Created directory: ${componentType}/${component.root_folder}`,
          )
        }
        await process_component_files(
          component,
          write_path,
          componentType,
          spinner,
        )
        await process_component_dependencies(component, componentType, spinner)

        spinner.succeed(
          `🦋 Installed component${components.length > 1 ? 's' : ''}: ${highlighter.info(
            `[${idx + 1}/${components.length}]`,
          )}\x1b[0K`,
        )
      }),
    )
  } catch (error) {
    spinner.fail(`🦆 Failed to install components`)
    throw error
  }
}

export async function process_component_files(
  component: Registry[0],
  write_path: string,
  componentType: string,
  spinner: Ora,
) {
  if (!component.files?.length) {
    spinner.warn(`🦆 No files found for component: ${componentType}`)
    return
  }

  for (const file of component.files) {
    const file_path = path.resolve(`${write_path}/${componentType}`, file.path)

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
  component: Registry[0],
  componentType: string,
  spinner: Ora,
) {
  try {
    spinner.text = `🦋 Installing dependencies for component: ${componentType}`

    if (!component.dependencies?.length) {
      spinner.warn(`🦆 No dependencies found for component: ${componentType}`)
      return
    }

    console.log(component.dependencies, component.registryDependencies)
  } catch (error) {
    spinner.fail(
      `🦆 Failed to install dependencies for component: ${componentType}`,
    )
  }
}
