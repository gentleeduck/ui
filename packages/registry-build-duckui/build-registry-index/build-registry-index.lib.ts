import path from 'node:path'
import { styleText } from 'node:util'
import { RegistryEntry } from '@gentleduck/registers'
import fg from 'fast-glob'
import { ENV } from '../main'
import { GetComponentFilesArgs } from './build-registry-index.types'

// ----------------------------------------------------------------------------

/**
 * Retrieves a list of component files from the registry based on the specified item type.
 *
 * This function scans the component's root folder for TypeScript (`.ts`) and TypeScript JSX (`.tsx`) files
 * and returns an updated registry item containing these files.
 */
export async function get_component_files({
  item,
  type,
  spinner,
  idx,
  registry_count,
}: GetComponentFilesArgs): Promise<RegistryEntry> {
  try {
    // Determine the base path depending on the type of registry item
    const basePath = `..${type.includes('ui') ? ENV.REGISTRY_UI_PATH : type.includes('example') ? ENV.REGISTRY_EXAMPLES_PATH : ENV.REGISTRY_BLOCKS_PATH}${item.root_folder}`
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
