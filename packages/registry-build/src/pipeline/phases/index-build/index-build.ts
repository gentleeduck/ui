import { mapConcurrently } from '../../../lib/concurrency'
import { writeFileIfChanged } from '../../../lib/fs'
import { createRegistryEntryCacheKey, isRegistryEntryAffectedByChangedPaths } from '../../change-detection'
import type { IRegistryBuildContext, IRegistryBuildPhaseResult } from '../../types'
import {
  createIndexEntrySignature,
  createIndexEntryStaticSignature,
  materializeIndexedEntries,
  resolveRegistryFiles,
} from './index-build.lib'
import type {
  IRegistryBuildIndexCacheEntry,
  IRegistryBuildIndexCacheState,
  IRegistryBuildMaterializedEntry,
} from './index-build.types'

export async function runIndexBuildPhase(context: IRegistryBuildContext): Promise<IRegistryBuildPhaseResult> {
  const previousCacheState = context.cache.getPhaseData<IRegistryBuildIndexCacheState>('index') ?? { entries: {} }
  const nextCacheEntries: IRegistryBuildIndexCacheState['entries'] = {}
  const allEntries = Object.values(context.config.registries).flat()
  let rebuiltEntryCount = 0
  let reusedEntryCount = 0

  const materializedEntries = await mapConcurrently(
    allEntries,
    context.config.performance.parallelism,
    async (entry): Promise<IRegistryBuildMaterializedEntry> => {
      const cacheKey = createRegistryEntryCacheKey(entry)
      const previousCacheEntry = previousCacheState.entries[cacheKey]
      const affectedByChanges = isRegistryEntryAffectedByChangedPaths(context, entry)
      const { files, source } = await resolveRegistryFiles(context, entry)
      const staticSignature = createIndexEntryStaticSignature(entry, source)

      if (!affectedByChanges && previousCacheEntry && previousCacheEntry.staticSignature === staticSignature) {
        reusedEntryCount += previousCacheEntry.indexedEntries.length
        nextCacheEntries[cacheKey] = previousCacheEntry

        return {
          cacheEntry: previousCacheEntry,
          cacheKey,
          indexedEntries: previousCacheEntry.indexedEntries,
          rebuilt: false,
        }
      }

      const signature = createIndexEntrySignature(entry, source, files)

      if (previousCacheEntry?.signature === signature) {
        reusedEntryCount += previousCacheEntry.indexedEntries.length
        nextCacheEntries[cacheKey] = previousCacheEntry

        return {
          cacheEntry: previousCacheEntry,
          cacheKey,
          indexedEntries: previousCacheEntry.indexedEntries,
          rebuilt: false,
        }
      }

      const indexedEntries = materializeIndexedEntries(context, entry, source, files)
      const cacheEntry: IRegistryBuildIndexCacheEntry = {
        indexedEntries,
        signature,
        staticSignature,
      }

      rebuiltEntryCount += indexedEntries.length
      nextCacheEntries[cacheKey] = cacheEntry

      return {
        cacheEntry,
        cacheKey,
        indexedEntries,
        rebuilt: true,
      }
    },
  )

  const index = materializedEntries.flatMap((entry) => entry.indexedEntries)
  const outputContent = JSON.stringify(index, null, 2)
  const wroteIndexFile = await writeFileIfChanged(context.getPath('indexFile'), outputContent)

  context.cache.setPhaseData<IRegistryBuildIndexCacheState>('index', {
    entries: nextCacheEntries,
  })
  context.setArtifact('index', index)
  context.registerOutput('index', context.getPath('indexFile'), {
    artifact: 'index',
    kind: 'registry-index',
  })

  return {
    details: `${rebuiltEntryCount} rebuilt, ${reusedEntryCount} reused`,
    itemCount: index.length,
    name: 'index',
    outputFiles: wroteIndexFile ? [context.getPath('indexFile')] : [],
  }
}
