import fs from 'node:fs/promises'
import path from 'node:path'
import { mapConcurrently } from '../../lib/concurrency'
import { generateBaseStylesWithVariables, generateThemeCss } from '../../lib/css-generator'
import { listFilesRecursively, pathExists, removeStaleFiles, writeFileIfChanged, writeJsonIfChanged } from '../../lib/fs'
import { hashValue } from '../../lib/hash'
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

interface RegistryBuildColorsCacheState {
  outputFiles: string[]
  signature: string
}

function resolveExtensionData<TValue>(value: TValue | string | undefined, label: string) {
  if (typeof value === 'string') {
    throw new Error(
      `${label} extension options require loaded data objects. Use root config file paths if you need loader-based resolution.`,
    )
  }

  return value
}

export async function runColorsPhase(
  context: RegistryBuildContext,
  options: RegistryBuildColorsPhaseOptions = {},
): Promise<RegistryBuildPhaseResult> {
  const previousCacheState = context.cache.getPhaseData<RegistryBuildColorsCacheState>('colors')
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
  const colorsIndexFile = path.join(context.getPath('colorsDir'), 'index.json')
  const outputFiles = [colorsIndexFile]

  for (const name of themeNames) {
    outputFiles.push(path.join(context.getPath('colorsDir'), `${name}.json`))
    outputFiles.push(path.join(context.getPath('themesDir'), `${name}.json`))
  }

  if (themeNames.length > 0) {
    outputFiles.push(context.getPath('themesCssFile'))
  }

  const signature = hashValue({
    colors,
    cssTemplates,
    cssVarKeys,
    defaultRadius,
    themeNames,
    themes,
  })
  const previousOutputFiles =
    previousCacheState?.outputFiles.length
      ? previousCacheState.outputFiles
      : [
          ...(await listFilesRecursively(context.getPath('colorsDir'))),
          ...(await listFilesRecursively(context.getPath('themesDir'))),
          ...((await pathExists(context.getPath('themesCssFile'))) ? [context.getPath('themesCssFile')] : []),
        ]
  const allOutputFilesExist = (await Promise.all(outputFiles.map((filePath) => pathExists(filePath)))).every(Boolean)

  if (previousCacheState?.signature === signature && allOutputFilesExist) {
    context.registerOutput('colors', outputFiles, {
      kind: 'colors-and-themes',
    })

    return {
      details: 'reused cached output',
      itemCount: themeNames.length,
      name: 'colors',
      outputFiles: [],
    }
  }

  await fs.mkdir(context.getPath('colorsDir'), { recursive: true })
  await fs.mkdir(context.getPath('themesDir'), { recursive: true })

  const processedColors = processRegistryColors(colors)
  const writtenFiles: string[] = []

  if (await writeJsonIfChanged(colorsIndexFile, processedColors)) {
    writtenFiles.push(colorsIndexFile)
  }

  if (themeNames.length === 0) {
    const removedFiles = await removeStaleFiles(outputFiles, previousOutputFiles)

    context.cache.setPhaseData<RegistryBuildColorsCacheState>('colors', {
      outputFiles,
      signature,
    })
    context.registerOutput('colors', outputFiles, {
      kind: 'colors-and-themes',
    })

    return {
      details: `${writtenFiles.length} written, ${outputFiles.length - writtenFiles.length} reused${
        removedFiles.length > 0 ? `, ${removedFiles.length} removed` : ''
      }`,
      itemCount: 0,
      name: 'colors',
      outputFiles: writtenFiles,
    }
  }

  const themeResults = await mapConcurrently(themeNames, context.config.performance.parallelism, async (name) => {
    const entry = themes[name]

    if (!entry) {
      throw new Error(`Theme "${name}" is missing from \`themes.data\`.`)
    }

    const radius = entry.radius || defaultRadius
    const colorFile = path.join(context.getPath('colorsDir'), `${name}.json`)
    const themeFile = path.join(context.getPath('themesDir'), `${name}.json`)
    const colorPayload = {
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
    }
    const themePayload = {
      name,
      label: entry.label,
      light: entry.light,
      dark: entry.dark,
      radius,
    }
    const themeCss = generateThemeCss({
      cssVarKeys,
      entry: {
        ...entry,
        radius,
      },
      name,
      radius,
    })
    const themeWrittenFiles: string[] = []

    if (await writeJsonIfChanged(colorFile, colorPayload)) {
      themeWrittenFiles.push(colorFile)
    }

    if (await writeJsonIfChanged(themeFile, themePayload)) {
      themeWrittenFiles.push(themeFile)
    }

    return {
      themeCss,
      writtenFiles: themeWrittenFiles,
    }
  })
  const themeCssBlocks = themeResults.map((result) => result.themeCss)
  const themeCssFile = context.getPath('themesCssFile')

  if (await writeFileIfChanged(themeCssFile, themeCssBlocks.join('\n\n'))) {
    writtenFiles.push(themeCssFile)
  }

  writtenFiles.push(...themeResults.flatMap((result) => result.writtenFiles))

  const removedFiles = await removeStaleFiles(outputFiles, previousOutputFiles)

  context.cache.setPhaseData<RegistryBuildColorsCacheState>('colors', {
    outputFiles,
    signature,
  })
  context.registerOutput('colors', outputFiles, {
    kind: 'colors-and-themes',
  })

  return {
    details: `${writtenFiles.length} written, ${outputFiles.length - writtenFiles.length} reused${
      removedFiles.length > 0 ? `, ${removedFiles.length} removed` : ''
    }`,
    itemCount: themeNames.length,
    name: 'colors',
    outputFiles: writtenFiles.sort((left, right) => left.localeCompare(right)),
  }
}
