import path from 'node:path'
import type { RegistryEntry } from '@gentleduck/registers'
import prompts from 'prompts'
import { get_duckui_config, highlighter, registry_component_install } from '~/utils'
import { get_registry_index, get_registry_item } from '~/utils/get-registry'
import { preflight_configs } from '~/utils/preflight-configs'
import { spinner as Spinner } from '~/utils/spinner'
import { type InitOptions, init_arguments_schema, init_options_schema } from './init.dto'

export async function init_command_action(args: string[], opt: InitOptions) {
  const spinner = Spinner('Initializing...').start()
  try {
    const options = init_options_schema.parse(opt)
    const cwd = path.resolve(options.cwd)

    const components_names = init_arguments_schema.parse(args)

    await preflight_configs({ ...options, cwd }, spinner)

    const registry = await get_registry_index()
    const filtered_registry = registry?.filter((item) => item.type === 'registry:ui')

    let components: RegistryEntry[] = []
    if (components_names.length > 0) {
      components = await Promise.all(
        components_names.map(async (item, idx) => {
          spinner.text = `🦆 Fetching components... ${highlighter.info(`[${idx}/${components_names.length}]`)}`
          return await get_registry_item(item as Lowercase<string>)
        }) as unknown as RegistryEntry[],
      )
    } else {
      spinner.stop()
      const install = await prompts({
        initial: true,
        message: 'Do you want to install components?',
        name: 'install',
        type: 'confirm',
      })

      if (!install.install) {
        spinner.succeed('🧑 Done.!, enjoy mr duck!🦆')
        process.exit(0)
      }

      spinner.stop()
      const prompt: { component: string[] } = await prompts([
        {
          choices: filtered_registry?.map((item) => ({
            title: item.name,
            value: item.name,
          })),
          message: 'Select component to install',
          name: 'component',
          type: 'autocompleteMultiselect',
        },
      ])
      spinner.start()

      components = (await Promise.all(
        prompt.component?.map(async (item, idx) => {
          spinner.text = `🦆 Fetching components... ${highlighter.info(`[${idx}/${prompt.component.length}]`)}`
          return await get_registry_item(item as Lowercase<string>)
        }),
      )) as RegistryEntry[]
    }

    if (!components.length) {
      spinner.fail('🦆 No components found to install')
      process.exit(0)
    }

    spinner.succeed(
      `🦆 Fetched component${components.length > 1 ? 's' : ''} ${highlighter.info(`[${components.length}/${components.length}]`)}`,
    )

    const duckui_config = await get_duckui_config(process.cwd(), spinner)

    await registry_component_install(components, duckui_config, options as never, spinner)

    spinner.succeed('🧑 Done.!, enjoy mr duck!🦆')
    process.exit(0)
  } catch (_error) {
    spinner.fail('🦆 Something went wrong')
  }
}
