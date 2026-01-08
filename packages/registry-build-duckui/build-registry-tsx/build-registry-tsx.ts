import { GetComponentFilesArgs } from './build-registry-tsx.types'

// ----------------------------------------------------------------------------

/**
 * Generates a TSX registry entry for a given registry item.
 *
 * @param {GetComponentFilesArgs} params- The registry component item.
 * @param {z.infer<typeof registry_schema>[number]} params.item - The registry component item.
 * @param {import("ora").Ora} params.spinner - The spinner instance for displaying progress.
 * @returns {Promise<string>} - The formatted TSXentry for the registry.
 */
export async function build_registry_tsx({ item, spinner }: GetComponentFilesArgs): Promise<string> {
  try {
    const component_path = `${
      item.type.includes('ui')
        ? `@gentleduck/registry-ui-duckui`
        : item.type.includes('example')
          ? `@gentleduck/registry-examples-duckui/${item.root_folder}`
          : `@gentleduck/registry-blocks-duckui/${item.root_folder}`
    }/${item?.name}`

    spinner.text = `🧭 Building TSX registry entry for ${item.name}`
    const registryEntry = `
    "${item.name}": {
      name: "${item.name}",
      description: "${item.description ?? ''}",
      type: "${item.type}",
      registryDependencies: ${JSON.stringify(item.registryDependencies)},
      files: ${JSON.stringify(item.files, null, 2)},
      component: React.lazy(() => import("${component_path}")),
      source: "${item.source}",
      categories: [${(item.categories ?? []).map((category) => `"${category}"`).join(', ')}],
      root_folder: "${item.root_folder}",
    },`

    spinner.text = `Successfully built TSX registry entry for ${item.name}`

    return registryEntry
  } catch (error) {
    spinner.fail(`Failed to build TSX registry entry: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(0)
  }
}
