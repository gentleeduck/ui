import type { RegistryEntry } from '@gentleduck/registers'
import type { Ora } from 'ora'
import prompts from 'prompts'
import { get_registry_index, get_registry_item } from './get-registry'
import { highlighter } from './text-styling'

/**
 * Resolves components either from explicit names or by prompting the user
 * to select from the registry. Returns a filtered array with no null entries.
 */
export async function resolve_components(component_names: string[], spinner: Ora): Promise<RegistryEntry[]> {
  let components: RegistryEntry[] = []

  if (component_names.length > 0) {
    const results = await Promise.all(
      component_names.map(async (item, idx) => {
        spinner.text = `Fetching components... ${highlighter.info(`[${idx}/${component_names.length}]`)}`
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

  return components
}
