import { z } from 'zod'
import fg from 'fast-glob'
import path from 'node:path'
import { registry_schema } from '@gentleduck/registers'
import { ENV } from '../main'
import { styleText } from 'node:util'
import { GetComponentFilesArgs } from './build-registry-index.types'

// ----------------------------------------------------------------------------

/**
 * Retrieves a list of component files from the registry based on the specified item type.
 *
 * This function scans the component's root folder for TypeScript (`.ts`) and TypeScript JSX (`.tsx`) files
 * and returns an updated registry item containing these files.
 *
 * @async
 * @param {GetComponentFilesArgs} args - The arguments required to fetch component files.
 * @param {z.infer<typeof registry_schema>[0]} args.item - The registry component item to retrieve files for.
 * @param {z.infer<typeof registry_schema>[0]['type']} args.type - The type of the registry component.
 * @param {import("ora").Ora} args.spinner - The spinner instance for displaying progress.
 * @param {number} args.idx - The current index of the item in the registry.
 * @param {number} args.registry_count - The total number of items in the registry.
 *
 * @returns {Promise<z.infer<typeof registry_schema>[0] | undefined>} A promise that resolves to the item with its associated files.
 * If no files are found, an empty `files` array is returned.
 *
 * @throws {Error} If an unexpected error occurs while retrieving the files, it is logged via `Logger.error`.
 */
export async function get_component_files({
  item,
  type,
  spinner,
  idx,
  registry_count,
}: GetComponentFilesArgs): Promise<z.infer<typeof registry_schema>[0] | undefined> {
  try {
    // Determine the base path depending on the type of registry item
    const basePath = `..${type.includes('ui') ? ENV.REGISTRY_UI_PATH : ENV.REGISTRY_EXAMPLES_PATH}${item.root_folder}`
    const cwdPath = path.join(process.cwd(), basePath)

    // Scan for TypeScript and TSX files within the component's root directory
    const files = await fg.glob('*.{ts,tsx}', { cwd: cwdPath, deep: 1 })

    if (files.length === 0) {
      spinner.warn(`No TypeScript or TSX files found in: ${cwdPath}`)
    } else {
      spinner.text = `🧭 Retrieving ${styleText(
        'green',
        type,
      )} component files... (${styleText('yellow', idx.toString())}/${styleText('yellow', registry_count.toString())})`
    }

    // Return the item with an updated list of its files
    return {
      ...item,
      files: files.map((file) => ({
        path: `${item.root_folder}/${file}`,
        type: item.type,
      })),
      source: `${type.includes('ui') ? ENV.REGISTRY_UI_PATH : ENV.REGISTRY_EXAMPLES_PATH}${item.root_folder}`,
    }
  } catch (error) {
    spinner.fail(`Failed to retrieve component files: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
