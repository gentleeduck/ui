import { z } from 'zod'
import fg from 'fast-glob'
import path from 'node:path'
import { registry_schema } from '@duck/registers'
import { ENV } from '../main'
import { Logger } from '../logger'

// ----------------------------------------------------------------------------

/**
 * Retrieves a list of component files from the registry based on the specified item type.
 *
 * This function scans the component's root folder for TypeScript (`.ts`) and TypeScript JSX (`.tsx`) files
 * and returns an updated registry item containing these files.
 *
 * @async
 * @param {z.infer<typeof registry_schema>[0]} item - The registry component item to retrieve files for.
 * @param {z.infer<typeof registry_schema>[0]['type']} type - The type of the registry component.
 *
 * @returns {Promise<z.infer<typeof registry_schema>[0]|undefined>} A promise that resolves to the item with its associated files.
 * If no files are found, an empty `files` array is returned.
 *
 * @throws {Error} If an unexpected error occurs while retrieving the files, it is logged via `Logger.error`.
 */
export async function get_component_files(
  item: z.infer<typeof registry_schema>[0],
  type: z.infer<typeof registry_schema>[0]['type'],
): Promise<z.infer<typeof registry_schema>[0] | undefined> {
  try {
    // Determine the base path depending on the type of registry item
    const basePath = `..${type.includes('ui') ? ENV.REGISTRY_UI_PATH : ENV.REGISTRY_EXAMPLES_PATH}${item.root_folder}`
    const cwdPath = path.join(process.cwd(), basePath)

    // Scan for TypeScript and TSX files within the component's root directory
    const files = await fg.glob('*.{ts,tsx}', { cwd: cwdPath, deep: 1 })

    if (files.length === 0) {
      Logger.warn(`No TypeScript or TSX files found in: ${cwdPath}`)
    } else {
      Logger.success('Component files retrieved successfully', {
        basePath,
        fileCount: files.length,
      })
    }

    // Return the item with an updated list of its files
    return {
      ...item,
      files: files.map((file) => ({
        path: `${item.root_folder}/${file}`,
        type: item.type,
      })),
    }
  } catch (error) {
    return Logger.throwFatalError(
      `Failed to retrieve component files: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
