import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Ora } from 'ora'
import { REGISTRY_PATH } from '../main/main.constants'
import { build_registry_themes, registry_build_colors_index } from './build-registry-build-colors.lib'

// ----------------------------------------------------------------------------

/**
 * Builds the registry colors by generating index, base colors, themes, and theme items.
 */
export async function registry_build_colors({ spinner }: { spinner: Ora }): Promise<void> {
  try {
    const colors_target_path = path.join(REGISTRY_PATH, 'colors')

    spinner.text = `Creating colors directory: ${colors_target_path}`
    await fs.rm(colors_target_path, { recursive: true, force: true })
    if (!existsSync(colors_target_path)) {
      await fs.mkdir(colors_target_path, { recursive: true })
    }

    const colors_data: Record<string, unknown> = {}

    spinner.text = `Creating colors index.json: ${colors_target_path}`
    await registry_build_colors_index(colors_data, colors_target_path, spinner)

    spinner.text = 'Creating registry base colors'
    await build_registry_themes(spinner)

    spinner.text = `Writing colors index.json: ${colors_target_path}`
  } catch (error) {
    spinner.fail(`Failed to build registry colors: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
