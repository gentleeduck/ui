import path from 'node:path'
import type { IResolvedRegistryBuildCssTemplates } from '../../../config/types'
import { generateBaseStylesWithVariables, generateThemeCss } from '../../../extensions/ui/lib/css-generator'
import type { IRegistryBuildThemeEntry } from '../../../extensions/ui/ui.config.types'
import { writeJsonIfChanged } from '../../../lib/fs'
import { assertSafeName, resolveWithinBase } from '../../../lib/safe-path'
import type { IRegistryBuildContext } from '../../types'
import type { IRegistryBuildColorsPhaseOptions } from './colors.types'

// Extensions get already-loaded data; only the root config supports path-based loading.
function resolveExtensionData<TValue>(value: TValue | string | undefined, label: string) {
  if (typeof value === 'string') {
    throw new Error(
      `${label} extension options require loaded data objects. Use root config file paths if you need loader-based resolution.`,
    )
  }

  return value
}

export function resolveColorsPhaseConfig(context: IRegistryBuildContext, options: IRegistryBuildColorsPhaseOptions) {
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

  return {
    colors,
    cssTemplates,
    cssVarKeys,
    defaultRadius,
    themeNames,
    themes,
  }
}

export function getColorsOutputFiles(context: IRegistryBuildContext, themeNames: string[]) {
  const colorsIndexFile = path.join(context.getPath('colorsDir'), 'index.json')
  const outputFiles = [colorsIndexFile]

  for (const name of themeNames) {
    // Schema restricts theme keys via `themeEntriesSchema`; assert once more before
    // joining so the runtime path stays inside colorsDir/themesDir.
    assertSafeName(name, `theme name`)
    outputFiles.push(resolveWithinBase(context.getPath('colorsDir'), `${name}.json`, `colors output for "${name}"`))
    outputFiles.push(resolveWithinBase(context.getPath('themesDir'), `${name}.json`, `theme output for "${name}"`))
  }

  if (themeNames.length > 0) {
    outputFiles.push(context.getPath('themesCssFile'))
  }

  return {
    colorsIndexFile,
    outputFiles,
  }
}

export async function processTheme(
  context: IRegistryBuildContext,
  name: string,
  entry: IRegistryBuildThemeEntry,
  options: {
    cssTemplates: IResolvedRegistryBuildCssTemplates
    cssVarKeys: string[]
    defaultRadius: string
  },
): Promise<{ themeCss: string; writtenFiles: string[] }> {
  assertSafeName(name, `theme name`)
  const radius = entry.radius || options.defaultRadius
  const colorFile = resolveWithinBase(context.getPath('colorsDir'), `${name}.json`, `colors output for "${name}"`)
  const themeFile = resolveWithinBase(context.getPath('themesDir'), `${name}.json`, `theme output for "${name}"`)
  const colorPayload = {
    cssVarsV4: {
      light: entry.light,
      dark: entry.dark,
    },
    inlineColorsTemplate: options.cssTemplates.baseStyles,
    cssVarsTemplate: generateBaseStylesWithVariables({
      baseLayerRules: options.cssTemplates.baseLayerRules,
      baseStyles: options.cssTemplates.baseStyles,
      cssVarKeys: options.cssVarKeys,
      entry: {
        ...entry,
        radius,
      },
      radius,
    }),
  }
  const themePayload = {
    name,
    label: entry.label,
    light: entry.light,
    dark: entry.dark,
    radius,
  }
  const themeCss = generateThemeCss({
    cssVarKeys: options.cssVarKeys,
    entry: {
      ...entry,
      radius,
    },
    name,
    radius,
  })
  const writtenFiles: string[] = []

  if (await writeJsonIfChanged(colorFile, colorPayload)) {
    writtenFiles.push(colorFile)
  }

  if (await writeJsonIfChanged(themeFile, themePayload)) {
    writtenFiles.push(themeFile)
  }

  return {
    themeCss,
    writtenFiles,
  }
}
