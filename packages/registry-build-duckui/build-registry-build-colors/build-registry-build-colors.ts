import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import rimraf from 'rimraf'
import { REGISTRY_PATH } from '../main/main.constants'
import { build_registry_themes, registry_build_colors_index } from './build-registry-build-colors.lib'
import { BuildRegistryColorsParams } from './build-registry-build-colors.types'

// ----------------------------------------------------------------------------

/**
 * Builds the registry colors by generating index, base colors, themes, and theme items.
 *
 * @async
 * @param {BuildRegistryColorsParams} params - The parameters for building the registry colors.
 * @param {Ora} params.spinner - The spinner instance for displaying progress.
 * @returns {Promise<void>} Resolves when all colors are built successfully.
 * @throws {Error} If any step fails.
 */
export async function registry_build_colors({ spinner }: BuildRegistryColorsParams): Promise<void> {
  try {
    const colors_target_path = path.join(REGISTRY_PATH, 'colors')

    spinner.text = `🧭 Creating colors directory: ${colors_target_path}`
    rimraf.sync(colors_target_path)
    if (!existsSync(colors_target_path)) {
      await fs.mkdir(colors_target_path, { recursive: true })
    }

    const colors_data: Record<string, unknown> = {}

    spinner.text = `🧭 Creating colors index.json: ${colors_target_path}`
    await registry_build_colors_index(colors_data, colors_target_path, spinner)

    spinner.text = '🧭 Creating registry base colors'
    await build_registry_themes(spinner)

    spinner.text = `🧭 Writing colors index.json: ${colors_target_path}`
  } catch (error) {
    spinner.fail(`Failed to build registry colors: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(0)
  }
}
