import fs from 'node:fs/promises'
import path from 'node:path'
import { styleText } from 'node:util'
import { registry_entry_schema } from '@gentleduck/registers'
import { PUBLIC_REGISTRY_PATH, REGISTRY_INDEX_WHITELIST } from '../main'
import { gen_temp_source_files, get_file_content, get_file_target } from './build-registry-components.lib'
import { GetComponentFilesParams, GetFileParams } from './build-registry-components.types'

// ----------------------------------------------------------------------------

/**
 * Builds registry components by processing the provided registry item.
 *
 * This function handles the setup and processing of a registry component while displaying progress
 * using a spinner. It does not return a value but ensures the item is correctly processed.
 */
export async function build_registry_components({
  item,
  spinner,
  registry_count,
  idx,
}: GetComponentFilesParams): Promise<void> {
  try {
    if (!REGISTRY_INDEX_WHITELIST.includes(item?.type) || !item.files) {
      spinner.warn(`Skipping registry item: ${item.name} (Not whitelisted)`)
      process.exit(0)
    }

    spinner.text = `🧭 Processing registry item: ${item.name} (${idx + 1}/${registry_count})`

    const files = await Promise.all(item.files.map((file) => get_file({ file, item, spinner })))

    const payload = registry_entry_schema.safeParse({ ...item, files })

    if (!payload.success) {
      spinner.warn(`Skipping registry item: ${item.name} (Schema validation failed)`)
      process.exit(0)
    }

    const filePath = path.join(PUBLIC_REGISTRY_PATH, `${item.name}.json`)
    const dirPath = path.dirname(filePath)

    spinner.text = `🧭 Building registry component: ${item.name} (${
      idx + 1
    }/${registry_count}) (${styleText('green', item.type)})`

    await fs.mkdir(dirPath, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(payload.data, null, 2), {
      encoding: 'utf8',
      flag: 'w',
      mode: 0o644,
    })

    spinner.text = `🧭 Built registry component: ${item.name} (${
      idx + 1
    }/${registry_count}) (${styleText('green', item.type)})`
  } catch (error) {
    spinner.fail(`Failed to build registry components: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Retrieves file content, generates a temporary source file, and determines its target path.
 */
export async function get_file({ file, item, spinner }: GetFileParams): Promise<typeof file | undefined> {
  try {
    spinner.text = `🧭 Processing file: ${file.path} (${item.name})`

    const content = await get_file_content({ file, spinner })
    const source_file = await gen_temp_source_files({ content, file, spinner })
    const target = await get_file_target({ file, item, spinner })

    return {
      content: source_file?.getText(),
      path: file.path,
      target,
      type: item.type,
    }
  } catch (error) {
    spinner.fail(`Failed to process file ${file.path}: ${error}`)
    process.exit(1)
  }
}
