import fs from 'node:fs/promises'
import path from 'node:path'
import {
  registry_base_colors,
  registry_color_mapping,
  registry_colors,
} from '@gentelduck/registers'
import template from 'lodash.template'
import {
  BASE_COLORS_NAMES,
  BASE_STYLES,
  BASE_STYLES_WITH_VARIABLES,
  THEME_STYLES_WITH_VARIABLES,
} from './build-registry-build-colors.constants'
import { REGISTRY_PATH } from '../main'
import rimraf from 'rimraf'
import { existsSync } from 'node:fs'
import { Ora } from 'ora'

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
            spinner.fail(`Invalid color object: ${JSON.stringify(value)}`)
            process.exit(0)
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

        spinner.text = `🧭 Invalid color value: ${JSON.stringify(value)}`
        process.exit(0)
      } catch (error) {
        spinner.fail(
          `🧭 Error processing color "${color}": ${
            error instanceof Error ? error.message : String(error)
          }`,
        )
        process.exit(0)
      }
    }

    const filePath = path.join(colors_target_path, 'index.json')

    await fs.writeFile(filePath, JSON.stringify(colors_data, null, 2), 'utf8')
    spinner.text = `🧭 Created colors index: ${filePath}`
  } catch (error) {
    spinner.fail(
      `Failed to build registry colors index: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    process.exit(0)
  }
}

// ----------------------------------------------------------------------------

/**
 * Builds the base registry colors by mapping Tailwind-like color scales to CSS variables.
 *
 * @async
 * @param {Record<string, any>} colors_data - The color data mapping base colors to their scales and HSL values.
 * @param {import("ora").Ora} spinner - The spinner instance for displaying progress.
 * @returns {Promise<void>} Resolves when the colors are processed.
 * @throws {Error} If any processing step fails.
 */
export async function build_registry_colors_base(
  colors_data: Record<string, any>,
  spinner: Ora,
): Promise<void> {
  try {
    spinner.text = '🧭 Creating registry base colors'
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
              spinner.fail(
                'Failed to build registry base colors: resolved_base not found',
              )
              process.exit(0)
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

      console.log(
        template(BASE_STYLES_WITH_VARIABLES)({
          colors: base.cssVars,
        }),
      )
      // base.inlineColorsTemplate = template(BASE_STYLES)({})
      // base.cssVarsTemplate = template(BASE_STYLES_WITH_VARIABLES)({
      //   colors: base.cssVars,
      // })
    }
  } catch (error) {
    spinner.fail(
      `Failed to build registry base colors: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    process.exit(0)
  }
}

// ----------------------------------------------------------------------------

/**
 * Generates and writes CSS themes from the registry base colors.
 *
 * @async
 * @param {import("ora").Ora} spinner - The spinner instance for displaying progress.
 * @returns {Promise<void>} Resolves when the themes.css file is successfully generated.
 * @throws {Error} If writing the file fails.
 */
export async function build_registry_colors_themes(
  spinner: Ora,
): Promise<void> {
  try {
    const theme_css: string[] = registry_base_colors.map((theme) =>
      template(THEME_STYLES_WITH_VARIABLES)({
        colors: theme.cssVars,
        theme: theme.name,
      }),
    )

    const filePath = path.join(REGISTRY_PATH, 'themes.css')
    spinner.text = `🧭 Creating themes.css: ${filePath}`

    await fs.writeFile(filePath, theme_css.join('\n'), 'utf8')
    spinner.text = `🧭 Created themes.css: ${filePath}`
  } catch (error) {
    spinner.fail(
      `Failed to build registry color themes: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    process.exit(0)
  }
}

// ----------------------------------------------------------------------------

/**
 * Builds and writes theme items based on base colors and color mappings.
 *
 * @async
 * @param {Record<string, any>} colors_data - The color data object.
 * @param {import("ora").Ora} spinner - The spinner instance for displaying progress.
 * @returns {Promise<void>} Resolves when all theme items are built and written.
 * @throws {Error} If writing the theme files fails.
 */
export async function build_registry_themes_item(
  colors_data: Record<string, any>,
  spinner: Ora,
): Promise<void> {
  try {
    const themes_target_path = path.join(REGISTRY_PATH, 'themes')
    spinner.text = `🧭 Creating themes directory: ${themes_target_path}`

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
              spinner.fail(
                'Failed to build registry base colors: resolved_base not found',
              )
              process.exit(0)
            }

            const color = scale
              ? colors_data[resolved_base]?.find(
                  (item: any) => item.scale === Number.parseInt(scale),
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
      spinner.text = `🧭 Created theme: ${filePath}`
    }
  } catch (error) {
    spinner.fail(
      `Failed to build registry themes: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    process.exit(0)
  }
}
