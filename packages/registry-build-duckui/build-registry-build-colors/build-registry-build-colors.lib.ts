import fs from 'node:fs/promises'
import path from 'node:path'
import { registry_colors, registry_themes } from '@gentleduck/registers'
import template from 'lodash.template'
import { BASE_STYLES_WITH_VARIABLES } from './build-registry-build-colors.constants'
import { REGISTRY_PATH } from '../main'
import { Ora } from 'ora'

// ----------------------------------------------------------------------------

export async function build_registry_themes(spinner: Ora): Promise<void> {
  try {
    spinner.text = '🧭 Creating registry themes'
    for (const theme of registry_themes) {
      const theme_json = template(BASE_STYLES_WITH_VARIABLES)(theme)

      await fs.writeFile(path.join(REGISTRY_PATH, 'themes', `${theme.name}.css`), theme_json, 'utf8')
    }
  } catch (error) {
    spinner.fail(`Failed to build registry themes: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(0)
  }
}

// ----------------------------------------------------------------------------

/**
 * Builds and writes the colors index file from the registry.
 *
 * @async
 * @param {Record<string, any>} colors_data - The color data object to populate.
 * @param {string} colors_target_path - The target directory for the index.json file.
 * @param {import("ora").Ora} spinner - The spinner instance for displaying progress.
 * @returns {Promise<void>} Resolves when the colors index is successfully written.
 * @throws {Error} If writing the file fails.
 *
 * //FIX: remove the any type when you modify the registry the next time.
 * //TODO: add the new theme to the registry
 */
export async function registry_build_colors_index(
  colors_data: Record<string, any>,
  colors_target_path: string,
  spinner: Ora,
): Promise<void> {
  try {
    if (!registry_colors || typeof registry_colors !== 'object') {
      spinner.fail('Invalid registry_colors: Expected an object.')
      process.exit(0)
    }

    for (const [color, value] of Object.entries(registry_colors)) {
      try {
        if (typeof value === 'string') {
          colors_data[color] = value
          continue
        }

        if (Array.isArray(value)) {
          colors_data[color] = value.map((item) => {
            if (!item.rgb || !item.hsl) {
              spinner.fail(`Invalid color array item: ${JSON.stringify(item)}`)
              process.exit(0)
            }
            return {
              ...item,
              rgbChannel: item.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
              hslChannel: item.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
            }
          })
          continue
        }

        if (typeof value === 'object' && value !== null) {
          if (!value.rgb || !value.hsl) {
            spinner.fail(`Invalid color object: ${JSON.stringify(value)}`)
            process.exit(0)
          }
          colors_data[color] = {
            ...value,
            rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
            hslChannel: value.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
          }
          continue
        }

        spinner.text = `🧭 Invalid color value: ${JSON.stringify(value)}`
        process.exit(0)
      } catch (error) {
        spinner.fail(`🧭 Error processing color "${color}": ${error instanceof Error ? error.message : String(error)}`)
        process.exit(0)
      }
    }

    const filePath = path.join(colors_target_path, 'index.json')

    await fs.writeFile(filePath, JSON.stringify(colors_data, null, 2), 'utf8')
    spinner.text = `🧭 Created colors index: ${filePath}`
  } catch (error) {
    spinner.fail(`Failed to build registry colors index: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(0)
  }
}
