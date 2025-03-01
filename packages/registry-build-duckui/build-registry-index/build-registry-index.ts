import { z } from 'zod'
import fs from 'node:fs/promises'
import path from 'node:path'
import rimraf from 'rimraf'
import { registry_schema } from '@duck/registers'
import { REGISTRY_PATH } from '../main'
import { get_component_files } from './build-registry-index.lib'
import { Logger } from '../logger'

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
 * @param {z.infer<typeof registry_schema>} registry - The full registry data.
 *
 * @returns {Promise<z.infer<typeof registry_schema> | undefined>}
 *          The updated registry with indexed files, or `undefined` if an error occurs.
 */
export async function build_registry_index(
  registry: z.infer<typeof registry_schema>,
): Promise<z.infer<typeof registry_schema> | undefined> {
  try {
    Logger.success('Building registry index...', {
      registryCount: registry.length,
    })

    // 1- Retrieve component files for UI and examples
    const uiItems = await Promise.all(
      registry
        .filter((item) => item.type === 'registry:ui')
        .map((item) => get_component_files(item, 'registry:ui')),
    )

    const exampleItems = await Promise.all(
      registry
        .filter((item) => item.type === 'registry:example')
        .map((item) => get_component_files(item, 'registry:example')),
    )

    // 2- Transform example items by separating their files
    const exampleItemsMapped = exampleItems.flatMap((item) => {
      if (!item?.files?.length) {
        Logger.error(`No files found for example item: ${item?.name}`)
        return
      }

      const files = item.files.splice(1) // Extract all files except the first
      return [
        {
          ...item,
          files: [item.files[0]], // Keep the first file
        },
        ...files.map((file) => ({
          ...item,
          name: file.path.split('/').pop()?.split('.')[0], // Extract name from filename
          files: [file],
        })),
      ]
    })

    // 3- Convert to JSON and replace index.json
    const registryJson = JSON.stringify(
      [...uiItems, ...exampleItemsMapped],
      null,
      2,
    )

    rimraf.sync(path.join(REGISTRY_PATH, 'index.json')) // Remove old index
    await fs.writeFile(
      path.join(REGISTRY_PATH, 'index.json'),
      registryJson,
      'utf8',
    )

    Logger.success('Registry index built successfully', {
      registryPath: REGISTRY_PATH,
      totalItems: uiItems.length + exampleItemsMapped.length,
    })

    return [...uiItems, ...exampleItemsMapped] as z.infer<
      typeof registry_schema
    >
  } catch (error) {
    return Logger.throwFatalError(
      `Failed to build registry index: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
