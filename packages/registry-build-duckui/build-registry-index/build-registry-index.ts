import { z } from 'zod'
import fs from 'node:fs/promises'
import path from 'node:path'
import rimraf from 'rimraf'
import { registry_schema } from '@gentleduck/registers'
import { REGISTRY_PATH } from '../main'
import { get_component_files } from './build-registry-index.lib'
import { styleText } from 'node:util'
import { BuildRegistryIndexParams } from './build-registry-index.types'

// ----------------------------------------------------------------------------

/**
 * Builds the registry index by collecting component and example files.
 *
 * This function:
 * 1. Filters and retrieves component files based on their registry type.
 * 2. Maps example items to separate their files into distinct entries.
 * 3. Writes the structured registry data into `index.json`, replacing any previous version.
 *
 * @async
 * @param {BuildRegistryIndexParams} props - The arguments required to build the registry index.
 * @param {z.infer<typeof registry_schema>} props.registry - The full registry data.
 * @param {import("ora").Ora} props.spinner - The spinner instance for displaying progress.
 *
 * @returns {Promise<z.infer<typeof registry_schema> | undefined>}
 *          The updated registry with indexed files, or `undefined` if an error occurs.
 */
export async function build_registry_index({
  registry,
  spinner,
}: BuildRegistryIndexParams): Promise<z.infer<typeof registry_schema> | undefined> {
  try {
    spinner.text = `🧭 Building registry index... (${styleText('green', registry.length.toString())} components)`
    spinner.text = `🧭 Retrieving ${styleText('green', 'ui')} component files...`

    const uiItems = await Promise.all(
      registry
        .filter((item) => item.type === 'registry:ui')
        .map((item, idx) =>
          get_component_files({
            item,
            type: 'registry:ui',
            spinner,
            idx,
            registry_count: registry.length,
          }),
        ),
    )

    spinner.text = `🧭 Retrieving ${styleText('green', 'example')} component files...`

    const exampleItems = await Promise.all(
      registry
        .filter((item) => item.type === 'registry:example')
        .map((item) =>
          get_component_files({
            item,
            type: 'registry:example',
            spinner,
            idx: 0,
            registry_count: registry.length,
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
        name: file.path.split('/').pop()?.split('.')[0], // Extract name from filename
        files: [file],
      }))
    })

    spinner.text = `🧭 Retrieving ${styleText('green', 'block')} component files...`

    const blocksItems = await Promise.all(
      registry
        .filter((item) => item.type === 'registry:block')
        .map((item) =>
          get_component_files({
            item,
            type: 'registry:block',
            spinner,
            idx: 0,
            registry_count: registry.length,
          }),
        ),
    )

    spinner.text = `🧭 Writing registry index to file... (${styleText(
      'green',
      (uiItems.length + exampleItemsMapped.length).toString(),
    )} items)`

    const registryJson = JSON.stringify([...uiItems, ...exampleItemsMapped, ...blocksItems], null, 2)

    rimraf.sync(path.join(REGISTRY_PATH, 'index.json'))
    await fs.writeFile(path.join(REGISTRY_PATH, 'index.json'), registryJson, 'utf8')

    return [...uiItems, ...exampleItemsMapped, ...blocksItems] as z.infer<typeof registry_schema>
  } catch (error) {
    spinner.fail(`🧭 Failed to build registry index: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
