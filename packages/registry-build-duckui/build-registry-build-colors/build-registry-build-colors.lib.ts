import fs from 'node:fs/promises'
import path from 'node:path'
import {
  registry_base_colors,
  registry_color_mapping,
  registry_colors,
} from '@duck/registers'
import template from 'lodash.template'
import {
  BASE_COLORS_NAMES,
  BASE_STYLES,
  BASE_STYLES_WITH_VARIABLES,
  THEME_STYLES_WITH_VARIABLES,
} from './build-registry-build-colors.constants'
import { REGISTRY_PATH } from '../main'
import { Logger } from '../logger'

// ----------------------------------------------------------------------------

/**
 * Builds and writes the colors index file from the registry.
 *
 * @param {Record<string, any>} colors_data - The color data object to populate.
 * @param {string} colors_target_path - The target directory for the index.json file.
 * @returns {Promise<void>} Resolves when the colors index is successfully written.
 * @throws {Error} If writing the file fails.
 */
export async function registry_build_colors_index(
  colors_data: Record<string, any>,
  colors_target_path: string,
): Promise<void> {
  try {
    if (!registry_colors || typeof registry_colors !== 'object') {
      Logger.throwFatalError('Invalid registry_colors: Expected an object.')
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
              Logger.error(`Invalid color array item: ${JSON.stringify(item)}`)
            }
            return {
              ...item,
              rgbChannel: item.rgb.replace(
                /^rgb\((\d+),(\d+),(\d+)\)$/,
                '$1 $2 $3',
              ),
              hslChannel: item.hsl.replace(
                /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
                '$1 $2 $3',
              ),
            }
          })
          continue
        }

        if (typeof value === 'object' && value !== null) {
          if (!value.rgb || !value.hsl) {
            Logger.error(`Invalid color object: ${JSON.stringify(value)}`)
          }
          colors_data[color] = {
            ...value,
            rgbChannel: value.rgb.replace(
              /^rgb\((\d+),(\d+),(\d+)\)$/,
              '$1 $2 $3',
            ),
            hslChannel: value.hsl.replace(
              /^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/,
              '$1 $2 $3',
            ),
          }
          continue
        }

        Logger.error(
          `Unexpected value type for color "${color}": ${JSON.stringify(value)}`,
        )
      } catch (error) {
        Logger.error(`Error processing color "${color}": ${error}`)
      }
    }

    const filePath = path.join(colors_target_path, 'index.json')

    await fs.writeFile(filePath, JSON.stringify(colors_data, null, 2), 'utf8')
    Logger.success('Successfully generated colors index', filePath)
  } catch (error) {
    Logger.throwFatalError(
      `Failed to build registry colors index: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

// ----------------------------------------------------------------------------

/**
 * Builds the base registry colors by mapping Tailwind-like color scales to CSS variables.
 *
 * @param {Record<string, any>} colors_data - The color data mapping base colors to their scales and HSL values.
 * @returns {Promise<void>} Resolves when the colors are processed.
 * @throws {Error} If any processing step fails.
 */
export async function build_registry_colors_base(
  colors_data: Record<string, any>,
): Promise<void> {
  try {
    for (const base_color of BASE_COLORS_NAMES) {
      const base: Record<string, any> = {
        inlineColors: {},
        cssVars: {},
      }

      for (const [mode, values] of Object.entries(registry_color_mapping)) {
        base.inlineColors[mode] = {}
        base.cssVars[mode] = {}

        for (const [key, value] of Object.entries(values)) {
          if (typeof value === 'string') {
            if (key.startsWith('chart-')) {
              base.cssVars[mode][key] = value
              continue
            }

            const resolved_color = value.replace(/{{base}}-/g, `${base_color}-`)
            base.inlineColors[mode][key] = resolved_color

            const [resolved_base, scale] = resolved_color.split('-')
            if (!resolved_base) {
              Logger.error(
                'Failed to build registry base colors: resolved_base not found',
              )
              return
            }

            const color = scale
              ? colors_data[resolved_base]?.find(
                  (item: any) => item.scale === Number.parseInt(scale),
                )
              : colors_data[resolved_base]

            if (color) {
              base.cssVars[mode][key] = color.hslChannel
            }
          }
        }
      }

      base.inlineColorsTemplate = template(BASE_STYLES)({})
      base.cssVarsTemplate = template(BASE_STYLES_WITH_VARIABLES)({
        colors: base.cssVars,
      })
    }
  } catch (error) {
    Logger.throwFatalError(
      `Failed to build registry base colors: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

// ----------------------------------------------------------------------------

/**
 * Generates and writes CSS themes from the registry base colors.
 *
 * @returns {Promise<void>} Resolves when the themes.css file is successfully generated.
 * @throws {Error} If writing the file fails.
 */
export async function build_registry_colors_themes(): Promise<void> {
  try {
    const theme_css: string[] = registry_base_colors.map((theme) =>
      template(THEME_STYLES_WITH_VARIABLES)({
        colors: theme.cssVars,
        theme: theme.name,
      }),
    )

    const filePath = path.join(REGISTRY_PATH, 'themes.css')

    await fs.writeFile(filePath, theme_css.join('\n'), 'utf8')
    Logger.success('Successfully generated theme CSS', filePath)
  } catch (error) {
    Logger.throwFatalError(
      `Failed to build registry color themes: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

// ----------------------------------------------------------------------------

/**
 * Builds and writes theme items based on base colors and color mappings.
 *
 * @param {Record<string, any>} colors_data - The color data object.
 * @returns {Promise<void>} Resolves when all theme items are built and written.
 * @throws {Error} If writing the theme files fails.
 */
export async function build_registry_themes_item(
  colors_data: Record<string, any>,
): Promise<void> {
  try {
    const themes_target_path = path.join(REGISTRY_PATH, 'themes')

    // Remove existing themes directory
    rimraf.sync(themes_target_path)

    for (const base_color of BASE_COLORS_NAMES) {
      const payload: Record<string, any> = {
        name: base_color,
        label: base_color.charAt(0).toUpperCase() + base_color.slice(1),
        cssVars: {},
      }

      for (const [mode, values] of Object.entries(registry_color_mapping)) {
        payload.cssVars[mode] = {}

        for (const [key, value] of Object.entries(values)) {
          if (typeof value === 'string') {
            const resolved_color = value.replace(/{{base}}-/g, `${base_color}-`)
            payload.cssVars[mode][key] = resolved_color

            const [resolved_base, scale] = resolved_color.split('-')
            if (!resolved_base) {
              Logger.error(
                'Failed to build registry base colors: resolved_base not found',
              )
              return
            }

            const color = scale
              ? colors_data[resolved_base]?.find(
                  (item: any) => item.scale === parseInt(scale),
                )
              : colors_data[resolved_base]

            if (color) {
              payload.cssVars[mode][key] = color.hslChannel
            }
          }
        }
      }

      // Ensure target directory exists
      if (!existsSync(themes_target_path)) {
        await fs.mkdir(themes_target_path, { recursive: true })
      }

      const filePath = path.join(themes_target_path, `${payload.name}.json`)
      await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8')
      Logger.success(`Successfully generated theme file`, filePath)
    }
  } catch (error) {
    Logger.throwFatalError(
      `Failed to build registry themes: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
