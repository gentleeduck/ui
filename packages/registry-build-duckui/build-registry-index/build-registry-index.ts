import fs from 'node:fs/promises'
import path from 'node:path'
import { styleText } from 'node:util'
import { RegistryEntry } from '@gentleduck/registers'
import { rimraf } from 'rimraf'
import { REGISTRY_PATH } from '../main'
import { get_component_files } from './build-registry-index.lib'
import { BuildRegistryIndexParams } from './build-registry-index.types'

// ----------------------------------------------------------------------------

/**
 * Builds the registry index by collecting component and example files.
 *
 * This function:
 * 1. Filters and retrieves component files based on their registry type.
 * 2. Maps example items to separate their files into distinct entries.
 * 3. Writes the structured registry data into `index.json`, replacing any previous version.
 */
export async function build_registry_index({ registry, spinner }: BuildRegistryIndexParams): Promise<RegistryEntry[]> {
  try {
    spinner.text = `🧭 Retrieving ${styleText('green', 'ui')} component files...`

    const uiItems = await Promise.all(
      registry.uis.map((item, idx) =>
        get_component_files({
          idx,
          item,
          registry_count: registry.uis.length,
          spinner,
          type: 'registry:ui',
        }),
      ),
    )

    spinner.text = `🧭 Retrieving ${styleText('green', 'example')} component files...`

    const exampleItems = await Promise.all(
      registry.examples.map((item) =>
        get_component_files({
          idx: 0,
          item,
          registry_count: registry.examples.length,
          spinner,
          type: 'registry:example',
        }),
      ),
    )

    spinner.text = `🧭 Transforming registry index...`

    const exampleItemsMapped = exampleItems.flatMap((item, idx) => {
      if (!item?.files?.length) {
        spinner.fail(`🧭 No files found for example item: ${item?.name}`)
        process.exit(1)
      }

      spinner.text = `🧭 Transforming registry index... (${styleText(
        'green',
        idx.toString(),
      )} of ${styleText('green', exampleItems.length.toString())})`

      return item.files.map((file) => ({
        ...item,
        files: [file],
        name: file.path.split('/').pop()?.split('.')[0] as string, // Extract name from filename
      }))
    })

    spinner.text = `🧭 Retrieving ${styleText('green', 'block')} component files...`

    const blocksItems = await Promise.all(
      registry.blocks.map((item) =>
        get_component_files({
          idx: 0,
          item,
          registry_count: registry.blocks.length,
          spinner,
          type: 'registry:block',
        }),
      ),
    )

    spinner.text = `🧭 Writing registry index to file... (${styleText('green', String(blocksItems.length + uiItems.length + exampleItems.length))} items)`

    const registryJson = JSON.stringify([...uiItems, ...exampleItemsMapped, ...blocksItems], null, 2)

    rimraf.sync(path.join(REGISTRY_PATH, 'index.json'))
    await fs.writeFile(path.join(REGISTRY_PATH, 'index.json'), registryJson, 'utf8')

    return [...uiItems, ...exampleItemsMapped, ...blocksItems]
  } catch (error) {
    spinner.fail(`🧭 Failed to build registry index: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
