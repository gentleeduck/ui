import type { RegistryEntry } from '@gentleduck/registers'
import type { Ora } from 'ora'
import prompts from 'prompts'
import { getRegistryIndex, getRegistryItem } from './get-registry'
import { highlighter } from './text-styling'

/** Empty `componentNames` triggers an interactive multiselect; the `__install_all__` sentinel expands to every UI entry. */
export async function resolveComponents(componentNames: string[], spinner: Ora): Promise<RegistryEntry[]> {
  let components: RegistryEntry[] = []

  if (componentNames.length > 0) {
    const results = await Promise.all(
      componentNames.map(async (item, idx) => {
        spinner.text = `Fetching components... ${highlighter.info(`[${idx + 1}/${componentNames.length}]`)}`
        return await getRegistryItem(item)
      }),
    )
    components = results.filter((item): item is RegistryEntry => item !== null)
  } else {
    const registry = await getRegistryIndex()
    const filteredRegistry = registry?.filter((item) => item.type === 'registry:ui')
    const INSTALL_ALL_VALUE = '__install_all__'

    spinner.stop()
    const prompt: { component: string[] } = await prompts([
      {
        choices: [
          {
            title: 'Install all components',
            value: INSTALL_ALL_VALUE,
          },
          ...(filteredRegistry?.map((item) => ({
            title: item.name,
            value: item.name,
          })) ?? []),
        ],
        message: 'Select component to install',
        name: 'component',
        type: 'autocompleteMultiselect',
      },
    ])
    spinner.start()

    if (!prompt.component?.length) {
      spinner.fail('No components selected')
      process.exit(0)
    }

    const selectedComponentNames = prompt.component.includes(INSTALL_ALL_VALUE)
      ? (filteredRegistry?.map((item) => item.name) ?? [])
      : prompt.component

    const promptResults = await Promise.all(
      selectedComponentNames.map(async (item, idx) => {
        spinner.text = `Fetching components... ${highlighter.info(`[${idx + 1}/${selectedComponentNames.length}]`)}`
        return await getRegistryItem(item)
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
