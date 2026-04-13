import fs from 'node:fs/promises'
import path from 'node:path'
import type { IIndexedRegistryEntry } from '../../../extensions/ui/ui.registry.types'
import { mapConcurrently } from '../../../lib/concurrency'
import { listFilesRecursively, pathExists, removeStaleFiles, writeJsonIfChanged } from '../../../lib/fs'
import { createRegistryEntryCacheKey, isRegistryEntryAffectedByChangedPaths } from '../../change-detection'
import type { IRegistryBuildContext, IRegistryBuildPhaseResult } from '../../types'
import { buildComponentPayload, createComponentSignature, createComponentStaticSignature } from './components.lib'
import type { IRegistryBuildComponentsCacheEntry, IRegistryBuildComponentsCacheState } from './components.types'

export async function runComponentsPhase(context: IRegistryBuildContext): Promise<IRegistryBuildPhaseResult> {
  const index = context.getArtifact<IIndexedRegistryEntry[]>('index') ?? []
  const previousCacheState = context.cache.getPhaseData<IRegistryBuildComponentsCacheState>('components') ?? {
    entries: {},
    outputFiles: [],
  }
  const previousOutputFiles =
    previousCacheState.outputFiles.length > 0
      ? previousCacheState.outputFiles
      : await listFilesRecursively(context.getPath('componentsDir'))
  const nextCacheEntries: IRegistryBuildComponentsCacheState['entries'] = {}
  await fs.mkdir(context.getPath('componentsDir'), { recursive: true })
  const componentResults = await mapConcurrently(index, context.config.performance.parallelism, async (item) => {
    const cacheKey = createRegistryEntryCacheKey(item)
    const outputFile = path.join(context.getPath('componentsDir'), `${item.name}.json`)
    const previousCacheEntry = previousCacheState.entries[cacheKey]
    const staticSignature = createComponentStaticSignature(context, item)
    const affectedByChanges = isRegistryEntryAffectedByChangedPaths(context, item)

    if (
      !affectedByChanges &&
      previousCacheEntry &&
      previousCacheEntry.staticSignature === staticSignature &&
      (await pathExists(outputFile))
    ) {
      nextCacheEntries[cacheKey] = previousCacheEntry

      return {
        cacheEntry: previousCacheEntry,
        outputFile,
        rebuilt: false,
        wroteFile: false,
      }
    }

    const signature = await createComponentSignature(context, item, staticSignature)

    if (previousCacheEntry && previousCacheEntry.signature === signature && (await pathExists(outputFile))) {
      nextCacheEntries[cacheKey] = previousCacheEntry

      return {
        cacheEntry: previousCacheEntry,
        outputFile,
        rebuilt: false,
        wroteFile: false,
      }
    }

    const payload = await buildComponentPayload(context, item)
    const wroteFile = await writeJsonIfChanged(outputFile, payload)
    const cacheEntry: IRegistryBuildComponentsCacheEntry = {
      outputFile,
      signature,
      staticSignature,
    }

    nextCacheEntries[cacheKey] = cacheEntry

    return {
      cacheEntry,
      outputFile,
      rebuilt: true,
      wroteFile,
    }
  })
  const outputFiles = componentResults
    .map((result) => result.outputFile)
    .sort((left, right) => left.localeCompare(right))
  const removedFiles = await removeStaleFiles(outputFiles, previousOutputFiles)
  const writtenFiles = componentResults
    .filter((result) => result.wroteFile)
    .map((result) => result.outputFile)
    .sort((left, right) => left.localeCompare(right))
  const rebuiltCount = componentResults.filter((result) => result.rebuilt).length
  const reusedCount = componentResults.length - rebuiltCount

  context.cache.setPhaseData<IRegistryBuildComponentsCacheState>('components', {
    entries: nextCacheEntries,
    outputFiles,
  })

  context.registerOutput('components', outputFiles, {
    artifact: 'index',
    kind: 'registry-components',
  })

  return {
    details: `${rebuiltCount} rebuilt, ${reusedCount} reused${removedFiles.length > 0 ? `, ${removedFiles.length} removed` : ''}`,
    itemCount: outputFiles.length,
    name: 'components',
    outputFiles: writtenFiles,
  }
}
