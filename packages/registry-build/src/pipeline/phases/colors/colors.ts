import fs from 'node:fs/promises'
import { processRegistryColors } from '../../../extensions/ui/lib/color-processor'
import { mapConcurrently } from '../../../lib/concurrency'
import {
  listFilesRecursively,
  pathExists,
  removeStaleFiles,
  writeFileIfChanged,
  writeJsonIfChanged,
} from '../../../lib/fs'
import { hashValue } from '../../../lib/hash'
import type { IRegistryBuildContext, IRegistryBuildPhaseResult } from '../../types'
import { getColorsOutputFiles, processTheme, resolveColorsPhaseConfig } from './colors.lib'
import type { IRegistryBuildColorsCacheState, IRegistryBuildColorsPhaseOptions } from './colors.types'

/**
 * Run the colors phase: process color data and theme entries, writing JSON
 * payloads and a combined CSS file. Skips work when the cache signature matches
 * and all expected output files already exist.
 */
export async function runColorsPhase(
  context: IRegistryBuildContext,
  options: IRegistryBuildColorsPhaseOptions = {},
): Promise<IRegistryBuildPhaseResult> {
  const previousCacheState = context.cache.getPhaseData<IRegistryBuildColorsCacheState>('colors')
  const { colors, cssTemplates, cssVarKeys, defaultRadius, themeNames, themes } = resolveColorsPhaseConfig(
    context,
    options,
  )
  const { colorsIndexFile, outputFiles } = getColorsOutputFiles(context, themeNames)

  const signature = hashValue({
    colors,
    cssTemplates,
    cssVarKeys,
    defaultRadius,
    themeNames,
    themes,
  })
  const previousOutputFiles = previousCacheState?.outputFiles.length
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

    context.cache.setPhaseData<IRegistryBuildColorsCacheState>('colors', {
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

    return processTheme(context, name, entry, { cssTemplates, cssVarKeys, defaultRadius })
  })
  const themeCssBlocks = themeResults.map((result) => result.themeCss)
  const themeCssFile = context.getPath('themesCssFile')

  if (await writeFileIfChanged(themeCssFile, themeCssBlocks.join('\n\n'))) {
    writtenFiles.push(themeCssFile)
  }

  writtenFiles.push(...themeResults.flatMap((result) => result.writtenFiles))

  const removedFiles = await removeStaleFiles(outputFiles, previousOutputFiles)

  context.cache.setPhaseData<IRegistryBuildColorsCacheState>('colors', {
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
