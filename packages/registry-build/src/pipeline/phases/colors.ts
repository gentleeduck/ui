import fs from 'node:fs/promises'
import path from 'node:path'
import { generateBaseStylesWithVariables, generateThemeCss } from '../../lib/css-generator'
import { processRegistryColors } from '../../lib/color-processor'
import type {
  RegistryBuildColorsConfig,
  RegistryBuildCssTemplates,
  RegistryBuildThemesConfig,
} from '../../types'
import type { RegistryBuildContext, RegistryBuildPhaseResult } from '../types'

export interface RegistryBuildColorsPhaseOptions {
  colors?: RegistryBuildColorsConfig
  cssTemplates?: RegistryBuildCssTemplates
  themes?: RegistryBuildThemesConfig
}

function resolveExtensionData<TValue>(value: TValue | string | undefined, label: string) {
  if (typeof value === 'string') {
    throw new Error(
      `${label} extension options require loaded data objects. Use root config file paths if you need loader-based resolution.`,
    )
  }

  return value
}

async function writeJson(filePath: string, value: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8')
}

export async function runColorsPhase(
  context: RegistryBuildContext,
  options: RegistryBuildColorsPhaseOptions = {},
): Promise<RegistryBuildPhaseResult> {
  const colorsConfig = {
    ...context.config.colors,
    ...options.colors,
  }
  const themesConfig = {
    ...context.config.themes,
    ...options.themes,
  }
  const cssTemplates = {
    ...context.config.cssTemplates,
    ...options.cssTemplates,
  }
  const colors = resolveExtensionData(colorsConfig.data, 'colors') ?? {}
  const themes = resolveExtensionData(themesConfig.data, 'themes') ?? {}
  const themeNames = themesConfig.names ?? Object.keys(themes)
  const cssVarKeys = themesConfig.cssVarKeys ?? []
  const defaultRadius = themesConfig.defaultRadius ?? '0.5rem'
  const outputFiles: string[] = []

  await fs.rm(context.getPath('colorsDir'), { force: true, recursive: true })
  await fs.rm(context.getPath('themesDir'), { force: true, recursive: true })
  await fs.rm(context.getPath('themesCssFile'), { force: true })
  await fs.mkdir(context.getPath('colorsDir'), { recursive: true })
  await fs.mkdir(context.getPath('themesDir'), { recursive: true })

  const processedColors = processRegistryColors(colors)
  await writeJson(path.join(context.getPath('colorsDir'), 'index.json'), processedColors)
  outputFiles.push(path.join(context.getPath('colorsDir'), 'index.json'))

  if (themeNames.length === 0) {
    context.registerOutput('colors', outputFiles, {
      kind: 'colors-and-themes',
    })

    return {
      itemCount: 0,
      name: 'colors',
      outputFiles,
    }
  }

  const themeCssBlocks: string[] = []

  for (const name of themeNames) {
    const entry = themes[name]
    if (!entry) {
      throw new Error(`Theme "${name}" is missing from \`themes.data\`.`)
    }

    const radius = entry.radius || defaultRadius
    const colorFile = path.join(context.getPath('colorsDir'), `${name}.json`)
    const themeFile = path.join(context.getPath('themesDir'), `${name}.json`)

    await writeJson(colorFile, {
      cssVarsV4: {
        light: entry.light,
        dark: entry.dark,
      },
      inlineColorsTemplate: cssTemplates.baseStyles,
      cssVarsTemplate: generateBaseStylesWithVariables({
        baseLayerRules: cssTemplates.baseLayerRules,
        baseStyles: cssTemplates.baseStyles,
        cssVarKeys,
        entry: {
          ...entry,
          radius,
        },
        radius,
      }),
    })
    await writeJson(themeFile, {
      name,
      label: entry.label,
      light: entry.light,
      dark: entry.dark,
      radius,
    })

    themeCssBlocks.push(
      generateThemeCss({
        cssVarKeys,
        entry: {
          ...entry,
          radius,
        },
        name,
        radius,
      }),
    )
    outputFiles.push(colorFile, themeFile)
  }

  await fs.writeFile(context.getPath('themesCssFile'), themeCssBlocks.join('\n\n'), 'utf8')
  outputFiles.push(context.getPath('themesCssFile'))
  context.registerOutput('colors', outputFiles, {
    kind: 'colors-and-themes',
  })

  return {
    itemCount: themeNames.length,
    name: 'colors',
    outputFiles,
  }
}
