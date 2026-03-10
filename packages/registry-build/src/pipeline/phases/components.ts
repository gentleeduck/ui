import fs from 'node:fs/promises'
import path from 'node:path'
import { registryEntrySchema } from '../../config/schema'
import { getRegistryFileTarget } from '../../lib/file-target'
import { pathExists, removeStaleFiles, writeJsonIfChanged, listFilesRecursively } from '../../lib/fs'
import { hashValue } from '../../lib/hash'
import { applyContentRewrites } from '../../lib/import-rewriter'
import { mapConcurrently } from '../../lib/concurrency'
import { stripSourceVariables } from '../../lib/ts-morph'
import { createRegistryEntryCacheKey, isRegistryEntryAffectedByChangedPaths } from '../change-detection'
import type { IndexedRegistryEntry, RegistryBuildContext, RegistryBuildPhaseResult } from '../types'

interface RegistryBuildComponentsCacheEntry {
  outputFile: string
  signature: string
  staticSignature: string
}

interface RegistryBuildComponentsCacheState {
  entries: Record<string, RegistryBuildComponentsCacheEntry>
  outputFiles: string[]
}

async function readRegistryFileContent(
  context: RegistryBuildContext,
  item: IndexedRegistryEntry,
  file: NonNullable<IndexedRegistryEntry['files']>[number],
) {
  if (typeof file.content === 'string') {
    return file.content
  }

  const source = context.config.sources[item.type]
  if (!source) {
    throw new Error(`Cannot resolve content for "${item.name}" because no source is configured for type "${item.type}".`)
  }

  return fs.readFile(path.join(source.path, file.path), 'utf8')
}

function createComponentStaticSignature(context: RegistryBuildContext, item: IndexedRegistryEntry) {
  const { tree: _tree, ...componentItem } = item

  return hashValue({
    componentItem,
    contentRewrites: context.config.importMappings.contentRewrites,
    outputTargets: (item.files ?? []).map((file) => ({
      path: file.path,
      target: getRegistryFileTarget(file, item, context.config),
      type: file.type,
    })),
    stripVariables: context.config.stripVariables,
  })
}

async function createComponentSignature(
  context: RegistryBuildContext,
  item: IndexedRegistryEntry,
  staticSignature: string,
) {
  const source = context.config.sources[item.type]
  const fileHashes = await Promise.all(
    (item.files ?? []).map(async (file) => {
      if (typeof file.content === 'string') {
        return {
          hash: hashValue(file.content),
          path: file.path,
        }
      }

      if (!source) {
        throw new Error(`Cannot hash content for "${item.name}" because no source is configured for type "${item.type}".`)
      }

      return {
        hash: await context.cache.getFileHash(path.join(source.path, file.path)),
        path: file.path,
      }
    }),
  )

  return hashValue({
    fileHashes,
    staticSignature,
  })
}

async function buildComponentPayload(context: RegistryBuildContext, item: IndexedRegistryEntry) {
  const { tree: _tree, ...componentItem } = item
  const transformedFiles = await Promise.all(
    (item.files ?? []).map(async (file) => {
      const content = await readRegistryFileContent(context, item, file)
      const stripped = stripSourceVariables({
        content,
        filePath: file.path,
        project: context.project,
        stripVariables: context.config.stripVariables,
      })
      const rewritten = applyContentRewrites(stripped, context.config.importMappings.contentRewrites)

      return {
        content: rewritten,
        path: file.path,
        target: getRegistryFileTarget(file, item, context.config),
        type: item.type,
      }
    }),
  )

  return registryEntrySchema.parse({
    ...componentItem,
    files: transformedFiles,
  })
}

export async function runComponentsPhase(context: RegistryBuildContext): Promise<RegistryBuildPhaseResult> {
  const index = context.getArtifact<IndexedRegistryEntry[]>('index') ?? []
  const previousCacheState = context.cache.getPhaseData<RegistryBuildComponentsCacheState>('components') ?? {
    entries: {},
    outputFiles: [],
  }
  const previousOutputFiles =
    previousCacheState.outputFiles.length > 0
      ? previousCacheState.outputFiles
      : await listFilesRecursively(context.getPath('componentsDir'))
  const nextCacheEntries: RegistryBuildComponentsCacheState['entries'] = {}
  await fs.mkdir(context.getPath('componentsDir'), { recursive: true })
  const componentResults = await mapConcurrently(
    index,
    context.config.performance.parallelism,
    async (item) => {
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
      const cacheEntry: RegistryBuildComponentsCacheEntry = {
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
    },
  )
  const outputFiles = componentResults.map((result) => result.outputFile).sort((left, right) => left.localeCompare(right))
  const removedFiles = await removeStaleFiles(outputFiles, previousOutputFiles)
  const writtenFiles = componentResults
    .filter((result) => result.wroteFile)
    .map((result) => result.outputFile)
    .sort((left, right) => left.localeCompare(right))
  const rebuiltCount = componentResults.filter((result) => result.rebuilt).length
  const reusedCount = componentResults.length - rebuiltCount

  context.cache.setPhaseData<RegistryBuildComponentsCacheState>('components', {
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
