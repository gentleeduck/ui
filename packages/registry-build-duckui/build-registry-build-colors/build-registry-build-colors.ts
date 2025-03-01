import fs from 'node:fs/promises'
import path from 'node:path'
import rimraf from 'rimraf'
import { existsSync } from 'node:fs'
import { REGISTRY_PATH } from '../main/main.constants'
import {
  build_registry_colors_base,
  build_registry_colors_themes,
  build_registry_themes_item,
  registry_build_colors_index,
} from './build-registry-build-colors.lib'
import { Logger } from '../logger'

// ----------------------------------------------------------------------------

/**
 * Builds the registry colors by generating index, base colors, themes, and theme items.
 *
 * @returns {Promise<void>} Resolves when all colors are built successfully.
 * @throws {Error} If any step fails.
 */
export async function registry_build_colors(): Promise<void> {
  try {
    const colors_target_path = path.join(REGISTRY_PATH, 'colors')

    // Remove existing colors directory and recreate it
    rimraf.sync(colors_target_path)
    if (!existsSync(colors_target_path)) {
      await fs.mkdir(colors_target_path, { recursive: true })
    }

    Logger.success('Initialized colors directory', colors_target_path)

    const colors_data: Record<string, unknown> = {}

    // Build index.json
    await registry_build_colors_index(colors_data, colors_target_path)

    // Build base colors
    await build_registry_colors_base(colors_data)

    // Build themes
    await build_registry_colors_themes()

    // Build theme item
    await build_registry_themes_item(colors_data)

    Logger.success('Successfully built registry colors', colors_target_path)
  } catch (error) {
    Logger.throwFatalError(
      `Failed to build registry colors: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
