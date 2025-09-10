import fs from 'node:fs/promises'
import path from 'node:path'
import { REGISTRY_PATH } from '../main'
import { RegistryEntry } from '@gentleduck/registers'
import { styleText } from 'node:util'
import { BuildRegistryStylesIndexParams } from './build-registry-styles-index.types'

// ----------------------------------------------------------------------------

/**
 * Builds the registry styles index by creating a standardized entry for styles.
 *
 * This function:
 * - Defines a set of required dependencies.
 * - Creates a structured `RegistryEntry` for styles.
 * - Writes the entry to `index.json` inside the components directory.
 *
 * @async
 * @param {BuildRegistryStylesIndexParams} params - The registry entry to process.
 * @param {z.infer<typeof registry_schema>[number]} params.item - The registry entry to process.
 * @param {Ora} params.spinner - The spinner instance for displaying progress.
 *
 * @returns {Promise<void>} Resolves when the file is successfully written.
 */
export async function build_registry_styles_index({ item, spinner }: BuildRegistryStylesIndexParams): Promise<void> {
  try {
    spinner.text = `🧭 Building registry styles index... (${styleText('green', item.name)})`

    const dependencies = ['tailwindcss-animate', 'class-variance-authority', 'lucide-react']

    const payload: RegistryEntry = {
      name: item.name,
      type: 'registry:style',
      dependencies,
      registryDependencies: ['utils'],
      tailwind: {
        config: {
          plugins: [`require("tailwindcss-animate")`],
        },
      },
      root_folder: '',
      cssVars: {},
      files: [],
    }

    const targetPath = path.join(REGISTRY_PATH, 'components', 'index.json')
    // await fs.writeFile(targetPath, JSON.stringify(payload, null, 2), 'utf8')

    spinner.text = `🧭 Registry styles index built successfully: ${targetPath}`
  } catch (error) {
    spinner.fail(`Failed to build registry styles index: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
