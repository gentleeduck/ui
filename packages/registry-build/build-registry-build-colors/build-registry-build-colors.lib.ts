import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { registry_colors, THEME_NAMES, themeRegistry } from '@gentleduck/registers'
import type { Ora } from 'ora'
import { REGISTRY_PATH } from '../main/main.constants'
import { BASE_STYLES, generateBaseStylesWithVariables, generateThemeCSS } from './build-registry-build-colors.constants'

// ----------------------------------------------------------------------------

export async function build_registry_themes(spinner: Ora) {
  spinner.text = 'Initializing registry themes build'

  // Helpers
  const ensureDir = async (p: string) => {
    if (!existsSync(p)) await fs.mkdir(p, { recursive: true })
  }
  const writeJson = async (p: string, data: any) => await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8')

  // --------------------------------------------------------------------------
  // Step 1: Build base colors index
  // --------------------------------------------------------------------------
  spinner.text = 'Generating base colors index'
  const colorsTargetPath = path.join(REGISTRY_PATH, 'colors')
  await fs.rm(colorsTargetPath, { recursive: true, force: true }) // clean start
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
        hslChannel: item.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
        rgbChannel: item.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
      }))
      continue
    }

    if (typeof value === 'object' && value !== null) {
      colorsData[color] = {
        ...value,
        hslChannel: value.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
        rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
      }
      continue
    }
  }
  await writeJson(path.join(colorsTargetPath, 'index.json'), colorsData)

  // --------------------------------------------------------------------------
  // Step 2: Generate per-theme-color JSON files
  // --------------------------------------------------------------------------
  spinner.text = 'Creating per-theme-color JSON files'

  for (const name of THEME_NAMES) {
    const entry = themeRegistry[name]
    const base: Record<string, any> = {
      cssVarsV4: { light: entry.light, dark: entry.dark },
      inlineColorsTemplate: BASE_STYLES,
      cssVarsTemplate: generateBaseStylesWithVariables(entry),
    }

    await writeJson(path.join(REGISTRY_PATH, `colors/${name}.json`), base)
  }

  // --------------------------------------------------------------------------
  // Step 3: Build themes.css
  // --------------------------------------------------------------------------
  spinner.text = 'Generating themes.css'
  const themeCSS: string[] = []
  for (const name of THEME_NAMES) {
    themeCSS.push(generateThemeCSS(name, themeRegistry[name]))
  }
  await fs.writeFile(path.join(REGISTRY_PATH, 'themes.css'), themeCSS.join('\n\n'), 'utf8')

  // --------------------------------------------------------------------------
  // Step 4: Build theme JSON files
  // --------------------------------------------------------------------------
  spinner.text = 'Creating individual theme JSON files'
  const themesTarget = path.join(REGISTRY_PATH, 'themes')
  await fs.rm(themesTarget, { recursive: true, force: true })
  await ensureDir(themesTarget)

  for (const name of THEME_NAMES) {
    const entry = themeRegistry[name]
    await writeJson(path.join(themesTarget, `${name}.json`), {
      name,
      label: entry.label,
      light: entry.light,
      dark: entry.dark,
      radius: entry.radius,
    })
  }

  // --------------------------------------------------------------------------
  // Done
  // --------------------------------------------------------------------------
  spinner.text = 'Registry themes build complete'
}

// ----------------------------------------------------------------------------

/**
 * Builds and writes the colors index file from the registry.
 */
export async function registry_build_colors_index(
  colors_data: Record<string, any>,
  colors_target_path: string,
  spinner: Ora,
): Promise<void> {
  try {
    if (!registry_colors || typeof registry_colors !== 'object') {
      spinner.fail('Invalid registry_colors: Expected an object.')
      process.exit(1)
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
              process.exit(1)
            }
            return {
              ...item,
              hslChannel: item.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
              rgbChannel: item.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
            }
          })
          continue
        }

        if (typeof value === 'object' && value !== null) {
          if (!value.rgb || !value.hsl) {
            spinner.fail(`Invalid color object: ${JSON.stringify(value)}`)
            process.exit(1)
          }
          colors_data[color] = {
            ...value,
            hslChannel: value.hsl.replace(/^hsl\(([\d.]+),([\d.]+%),([\d.]+%)\)$/, '$1 $2 $3'),
            rgbChannel: value.rgb.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1 $2 $3'),
          }
          continue
        }

        spinner.text = `Invalid color value: ${JSON.stringify(value)}`
        process.exit(1)
      } catch (error) {
        spinner.fail(`Error processing color "${color}": ${error instanceof Error ? error.message : String(error)}`)
        process.exit(1)
      }
    }

    const filePath = path.join(colors_target_path, 'index.json')

    await fs.writeFile(filePath, JSON.stringify(colors_data, null, 2), 'utf8')
    spinner.text = `Created colors index: ${filePath}`
  } catch (error) {
    spinner.fail(`Failed to build registry colors index: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}
