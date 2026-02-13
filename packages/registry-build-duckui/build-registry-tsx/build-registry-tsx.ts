import { BuildRegistryTsxResult, GetComponentFilesArgs } from './build-registry-tsx.types'

// ----------------------------------------------------------------------------

/**
 * Converts a kebab-case registry name to a valid JS identifier.
 * e.g. "accordion" -> "_Accordion", "chart-area-axes" -> "_ChartAreaAxes"
 */
function toIdentifier(name: string): string {
  return (
    '_' +
    name
      .split('-')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('')
  )
}

// ----------------------------------------------------------------------------

/**
 * Generates a next/dynamic declaration and a TSX registry entry for a given registry item.
 * Uses next/dynamic with ssr: false so components are client-rendered (avoids RSC
 * boundary violations for blocks that pass event handlers as props).
 *
 * @param {GetComponentFilesArgs} params - The registry component item.
 * @param {z.infer<typeof registry_schema>[number]} params.item - The registry component item.
 * @param {import("ora").Ora} params.spinner - The spinner instance for displaying progress.
 * @returns {Promise<BuildRegistryTsxResult>} - The declaration and registry entry.
 */
export async function build_registry_tsx({ item, spinner }: GetComponentFilesArgs): Promise<BuildRegistryTsxResult> {
  try {
    const component_path = `${
      item.type.includes('ui')
        ? `@gentleduck/registry-ui-duckui`
        : item.type.includes('example')
          ? `@gentleduck/registry-examples-duckui/${item.root_folder}`
          : `@gentleduck/registry-blocks-duckui/${item.root_folder}`
    }/${item?.name}`

    const id = toIdentifier(item.name)

    spinner.text = `🧭 Building TSX registry entry for ${item.name}`

    const importLine = `const ${id} = dynamic(() => import("${component_path}"), { ssr: false })\n`

    const entry = `
    "${item.name}": {
      name: "${item.name}",
      description: "${item.description ?? ''}",
      type: "${item.type}",
      registryDependencies: ${JSON.stringify(item.registryDependencies)},
      files: ${JSON.stringify(item.files, null, 2)},
      component: ${id},
      source: "${item.source}",
      categories: [${(item.categories ?? []).map((category) => `"${category}"`).join(', ')}],
      root_folder: "${item.root_folder}",
    },`

    spinner.text = `Successfully built TSX registry entry for ${item.name}`

    return { importLine, entry }
  } catch (error) {
    spinner.fail(`Failed to build TSX registry entry: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(0)
  }
}
