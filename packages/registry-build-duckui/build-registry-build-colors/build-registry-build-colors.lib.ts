import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { baseColors, baseColorsOKLCH, colorMapping, registry_colors, registry_themes } from '@gentleduck/registers'
import template from 'lodash.template'
import { Ora } from 'ora'
import rimraf from 'rimraf'
import { REGISTRY_PATH } from '../main'
import {
  BASE_STYLES,
  BASE_STYLES_WITH_VARIABLES,
  THEME_STYLES_WITH_VARIABLES,
} from './build-registry-build-colors.constants'

// ----------------------------------------------------------------------------

export async function build_registry_themes(spinner: Ora) {
  spinner.text = '🧭 Initializing registry themes build'

  // Helpers
  const ensureDir = async (p: string) => {
    if (!existsSync(p)) await fs.mkdir(p, { recursive: true })
  }
  const writeJson = async (p: string, data: any) => await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8')

  // --------------------------------------------------------------------------
  // Step 1: Build base colors index
  // --------------------------------------------------------------------------
  spinner.text = '🎨 Generating base colors index'
  const colorsTargetPath = path.join(REGISTRY_PATH, 'colors')
  rimraf.sync(colorsTargetPath) // clean start
  await ensureDir(colorsTargetPath)

  const colorsData: Record<string, any> = {}
  for (const [color, value] of Object.entries(registry_colors)) {
    if (typeof value === 'string') {
      colorsData[color] = value
      continue
    }

    if (Array.isArray(value)) {
      colorsData[color] = value.map((item) => ({
        ...item,
        rgbChannel: item.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
        hslChannel: item.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
      }))
      continue
    }

    if (typeof value === 'object' && value !== null) {
      colorsData[color] = {
        ...value,
        rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
        hslChannel: value.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
      }
      continue
    }
  }
  await writeJson(path.join(colorsTargetPath, 'index.json'), colorsData)

  // --------------------------------------------------------------------------
  // Step 2: Generate base color JSON files
  // --------------------------------------------------------------------------
  spinner.text = '🧩 Creating per-base-color JSON files'
  const baseColorsList = Object.keys(baseColorsOKLCH)

  for (const baseColor of baseColorsList) {
    const base: Record<string, any> = {
      inlineColors: {},
      cssVars: {},
    }

    for (const [mode, values] of Object.entries(colorMapping)) {
      base.inlineColors[mode] = {}
      base.cssVars[mode] = {}
      for (const [key, value] of Object.entries(values)) {
        if (typeof value !== 'string') continue

        // Chart colors special-case
        if (key.startsWith('chart-')) {
          base.cssVars[mode][key] = value
          continue
        }

        const resolvedColor = value.replace(/{{base}}-/g, `${baseColor}-`)
        base.inlineColors[mode][key] = resolvedColor

        const [resolvedBase, scale] = resolvedColor.split('-')
        const color = scale
          ? colorsData[resolvedBase!]?.find((item: any) => item.scale === parseInt(scale))
          : colorsData[resolvedBase!]

        if (color) {
          base.cssVars[mode][key] = color.hslChannel
        }
      }
    }

    // v4 vars
    base.cssVarsV4 = baseColorsOKLCH[baseColor as keyof typeof baseColorsOKLCH]

    // Templates
    base.inlineColorsTemplate = template(BASE_STYLES)({})
    base.cssVarsTemplate = template(BASE_STYLES_WITH_VARIABLES)({
      colors: base.cssVars,
    })

    await writeJson(path.join(REGISTRY_PATH, `colors/${baseColor}.json`), base)
  }

  // --------------------------------------------------------------------------
  // Step 3: Build themes.css
  // --------------------------------------------------------------------------
  spinner.text = '📄 Generating themes.css'
  const themeCSS: string[] = []
  for (const theme of baseColors) {
    themeCSS.push(
      template(THEME_STYLES_WITH_VARIABLES)({
        colors: theme.cssVars,
        theme: theme.name,
      }),
    )
  }
  await fs.writeFile(path.join(REGISTRY_PATH, `themes.css`), themeCSS.join('\n'), 'utf8')

  // --------------------------------------------------------------------------
  // Step 4: Build theme JSON files
  // --------------------------------------------------------------------------
  spinner.text = '📦 Creating individual theme JSON files'
  const themesTarget = path.join(REGISTRY_PATH, 'themes')
  rimraf.sync(themesTarget)
  await ensureDir(themesTarget)

  for (const theme of registry_themes) {
    console.log(path.join(themesTarget, `${theme.name}.json`))
    await writeJson(path.join(themesTarget, `${theme.name}.json`), theme)
  }

  // --------------------------------------------------------------------------
  // Done 🎉
  // --------------------------------------------------------------------------
  spinner.text = '✅ Registry themes build complete'
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
