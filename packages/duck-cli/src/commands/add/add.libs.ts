import type { RegistryEntry } from '@gentleduck/registers'
import prompts from 'prompts'
import { highlighter } from '~/utils'
import { get_duckui_config } from '~/utils/get-project-info'
import { get_registry_index, get_registry_item } from '~/utils/get-registry'
import { registry_component_install } from '~/utils/registry-mutation'
import { spinner as Spinner } from '~/utils/spinner'
import { add_arguments_schema, add_options_schema, type addOptions } from './add.dto'

export async function add_command_action(args: string[], opt: addOptions) {
  const spinner = Spinner('initializing...').start()
  try {
    const options = add_options_schema.parse(opt)

    const components_names = add_arguments_schema.parse(args)
    let components: RegistryEntry[] = []

    if (components_names.length) {
      const results = await Promise.all(
        components_names.map(async (item, idx) => {
          spinner.text = `Fetching components... ${highlighter.info(`[${idx}/${components_names.length}]`)}`
          return await get_registry_item(item as Lowercase<string>)
        }),
      )
      components = results.filter((item): item is RegistryEntry => item !== null)
    } else {
      const registry = await get_registry_index()
      const filtered_registry = registry?.filter((item) => item.type === 'registry:ui')

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

      const promptResults = await Promise.all(
        prompt.component?.map(async (item, idx) => {
          spinner.text = `Fetching components... ${highlighter.info(`[${idx}/${prompt.component.length}]`)}`
          return await get_registry_item(item as Lowercase<string>)
        }),
      )
      components = promptResults.filter((item): item is RegistryEntry => item !== null)
    }

    if (!components.length) {
      spinner.fail('No components found to install')
      process.exit(0)
    }

    spinner.succeed(
      `Fetched component${components.length > 1 ? 's' : ''} ${highlighter.info(`[${components.length}/${components.length}]`)}`,
    )

    const duckui_config = await get_duckui_config(process.cwd(), spinner)

    await registry_component_install(components, duckui_config, options, spinner)

    spinner.succeed('Done.!, enjoy mr duck!')
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  }
}
