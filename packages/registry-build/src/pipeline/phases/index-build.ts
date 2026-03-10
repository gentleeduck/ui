import path from 'node:path'
import fg from 'fast-glob'
import { createRegistryFileTree } from '../../lib/file-tree'
import { hashValue } from '../../lib/hash'
import { mapConcurrently } from '../../lib/concurrency'
import { joinPosix, normalizeSlashes } from '../../lib/path'
import { writeFileIfChanged } from '../../lib/fs'
import type { RegistryBuildSource, RegistryEntry, RegistryItemFile } from '../../types'
import { createRegistryEntryCacheKey, isRegistryEntryAffectedByChangedPaths } from '../change-detection'
import type { IndexedRegistryEntry, RegistryBuildContext, RegistryBuildPhaseResult } from '../types'

interface RegistryBuildIndexCacheEntry {
  indexedEntries: IndexedRegistryEntry[]
  signature: string
  staticSignature: string
}

interface RegistryBuildIndexCacheState {
  entries: Record<string, RegistryBuildIndexCacheEntry>
}

interface RegistryBuildMaterializedEntry {
  cacheEntry: RegistryBuildIndexCacheEntry
  cacheKey: string
  indexedEntries: IndexedRegistryEntry[]
  rebuilt: boolean
}

function getSourceReference(source: RegistryBuildSource, context: RegistryBuildContext, entry: RegistryEntry) {
  const baseReference = source.referencePath ?? normalizeSlashes(path.relative(context.configDir, source.path))
  return joinPosix(baseReference, entry.root_folder)
}

async function discoverRegistryFiles(source: RegistryBuildSource, entry: RegistryEntry): Promise<RegistryItemFile[]> {
  const discoveryRoot = path.join(source.path, entry.root_folder)
  const files = (
    await fg(source.glob ?? '**/*.{ts,tsx}', {
      cwd: discoveryRoot,
      ignore: source.ignore,
      onlyFiles: true,
    })
  ).sort((left, right) => {
    const leftDepth = left.split('/').length
    const rightDepth = right.split('/').length

    if (leftDepth !== rightDepth) {
      return leftDepth - rightDepth
    }

    return left.localeCompare(right)
  })

  if (files.length === 0) {
    throw new Error(`No files found for entry "${entry.name}" in "${discoveryRoot}".`)
  }

  return files.map((filePath) => ({
    path: joinPosix(entry.root_folder, filePath),
    type: entry.type,
  }))
}

function createIndexedEntries(entry: IndexedRegistryEntry, source?: RegistryBuildSource) {
  if (source?.indexStrategy !== 'file' || !entry.files?.length) {
    return [entry]
  }

  return entry.files.map((file) => ({
    ...entry,
    files: [file],
    name: path.posix.basename(file.path, path.posix.extname(file.path)),
  }))
}

async function resolveRegistryFiles(context: RegistryBuildContext, entry: RegistryEntry) {
  const source = context.config.sources[entry.type]
  const files = entry.files?.length ? entry.files : source ? await discoverRegistryFiles(source, entry) : []

  return {
    files: files.map((file) => ({
      ...file,
      path: normalizeSlashes(file.path),
      type: file.type || entry.type,
    })),
    source,
  }
}

function createIndexEntryStaticSignature(entry: RegistryEntry, source?: RegistryBuildSource) {
  return hashValue({
    entry: {
      ...entry,
      files: entry.files?.map((file) => ({
        path: normalizeSlashes(file.path),
        target: file.target,
        type: file.type,
      })),
    },
    source: source
      ? {
          glob: source.glob,
          ignore: source.ignore,
          indexStrategy: source.indexStrategy,
          referencePath: source.referencePath,
        }
      : null,
  })
}

function createIndexEntrySignature(
  entry: RegistryEntry,
  source: RegistryBuildSource | undefined,
  files: RegistryItemFile[],
) {
  return hashValue({
    files: files.map((file) => ({
      path: file.path,
      target: file.target,
      type: file.type,
    })),
    sourceReference: source?.referencePath ?? null,
    staticSignature: createIndexEntryStaticSignature(entry, source),
  })
}

function materializeIndexedEntries(
  context: RegistryBuildContext,
  entry: RegistryEntry,
  source: RegistryBuildSource | undefined,
  files: RegistryItemFile[],
) {
  const indexedEntry: IndexedRegistryEntry = {
    ...entry,
    files,
    source: source ? getSourceReference(source, context, entry) : entry.source,
    tree: createRegistryFileTree(
      files.map((file) => file.path),
      { basePath: entry.root_folder },
    ),
  }

  return createIndexedEntries(indexedEntry, source)
}

export async function runIndexBuildPhase(context: RegistryBuildContext): Promise<RegistryBuildPhaseResult> {
  const previousCacheState = context.cache.getPhaseData<RegistryBuildIndexCacheState>('index') ?? { entries: {} }
  const nextCacheEntries: RegistryBuildIndexCacheState['entries'] = {}
  const allEntries = Object.values(context.config.registries).flat()
  let rebuiltEntryCount = 0
  let reusedEntryCount = 0

  const materializedEntries = await mapConcurrently(
    allEntries,
    context.config.performance.parallelism,
    async (entry): Promise<RegistryBuildMaterializedEntry> => {
      const cacheKey = createRegistryEntryCacheKey(entry)
      const previousCacheEntry = previousCacheState.entries[cacheKey]
      const affectedByChanges = isRegistryEntryAffectedByChangedPaths(context, entry)
      const { files, source } = await resolveRegistryFiles(context, entry)
      const staticSignature = createIndexEntryStaticSignature(entry, source)

      if (
        !affectedByChanges &&
        previousCacheEntry &&
        previousCacheEntry.staticSignature === staticSignature
      ) {
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
      const cacheEntry: RegistryBuildIndexCacheEntry = {
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

  context.cache.setPhaseData<RegistryBuildIndexCacheState>('index', {
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
