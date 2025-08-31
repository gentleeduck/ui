import fs from 'node:fs/promises'
import path from 'node:path'
import rimraf from 'rimraf'
import { ENV } from '../main'
import { WriteIndexTsxParams } from './build-registry-tsx.types'

// ----------------------------------------------------------------------------

/**
 * Writes the provided TSX content to `index.tsx` inside the UI registry output path.
 *
 * This function:
 * - Ensures the TSX content is properly formatted.
 * - Deletes any existing `index.tsx` file in the target directory.
 * - Writes the new content to `index.tsx`.
 *
 * @async
 * @param {WriteIndexTsxParams} params - The parameters for writing the index TSX file.
 * @param {string} params.tsx_content - The TSX content to be written to `index.tsx`.
 * @param {Ora} params.spinner - The spinner instance for displaying progress.
 *
 * @returns {Promise<void>} Resolves when the file is successfully written.
 */
export async function write_index_tsx({ tsx_content, spinner }: WriteIndexTsxParams): Promise<void> {
  try {
    tsx_content += `\n}`

    const targetPath = path.join(process.cwd(), `../..${ENV.REGISTRY_OUTPUT_PATH}__ui_registry__/index.tsx`)
    spinner.text = `🧭 Writing UI registry index file: ${targetPath}`

    // Remove existing index.tsx file if present
    rimraf.sync(targetPath)

    // Write new TSX content
    await fs.writeFile(targetPath, tsx_content, 'utf8')

    spinner.text = `UI registry index file written successfully: ${targetPath}`
  } catch (error) {
    spinner.fail(`Failed to write UI registry index file: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
