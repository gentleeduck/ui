import fs from 'node:fs/promises'
import { pathExists, writeJsonIfChanged } from '../../lib/fs'
import { hashString } from '../../lib/hash'
import { normalizeSlashes } from '../../lib/path'

const REGISTRY_BUILD_CACHE_VERSION = 1

interface IRegistryBuildFileHashRecord {
  hash: string
  mtimeMs: number
  size: number
}

interface IRegistryBuildCacheManifest {
  fileHashes: Record<string, IRegistryBuildFileHashRecord>
  phases: Record<string, unknown>
  version: number
}

/** Persistent cache store for file hashes and phase data across registry builds. */
export interface IRegistryBuildCacheStore {
  enabled: boolean
  filePath: string
  getFileHash: (filePath: string) => Promise<string>
  getPhaseData: <TValue = unknown>(phase: string) => TValue | undefined
  save: () => Promise<void>
  setPhaseData: <TValue>(phase: string, value: TValue) => TValue
}

function createEmptyManifest(): IRegistryBuildCacheManifest {
  return {
    fileHashes: {},
    phases: {},
    version: REGISTRY_BUILD_CACHE_VERSION,
  }
}

function normalizeCacheKey(filePath: string) {
  return normalizeSlashes(filePath)
}

/** Create a cache store that persists file hashes and phase data to disk for incremental rebuilds. */
export async function createRegistryBuildCache(options: {
  enabled: boolean
  filePath: string
}): Promise<IRegistryBuildCacheStore> {
  const manifest =
    options.enabled && (await pathExists(options.filePath))
      ? await fs.readFile(options.filePath, 'utf8').then((content) => JSON.parse(content) as IRegistryBuildCacheManifest)
      : createEmptyManifest()
  const cacheManifest = manifest.version === REGISTRY_BUILD_CACHE_VERSION ? manifest : createEmptyManifest()
  let dirty = cacheManifest.version !== manifest.version

  return {
    enabled: options.enabled,
    filePath: options.filePath,
    getFileHash: async (filePath) => {
      const absolutePath = normalizeCacheKey(filePath)
      const stats = await fs.stat(filePath)
      const existingEntry = cacheManifest.fileHashes[absolutePath]

      if (existingEntry && existingEntry.mtimeMs === stats.mtimeMs && existingEntry.size === stats.size) {
        return existingEntry.hash
      }

      const hash = hashString(await fs.readFile(filePath, 'utf8'))
      cacheManifest.fileHashes[absolutePath] = {
        hash,
        mtimeMs: stats.mtimeMs,
        size: stats.size,
      }
      dirty = true
      return hash
    },
    getPhaseData: (phase) => cacheManifest.phases[phase] as never,
    save: async () => {
      if (!options.enabled || !dirty) {
        return
      }

      await writeJsonIfChanged(options.filePath, cacheManifest)
      dirty = false
    },
    setPhaseData: (phase, value) => {
      cacheManifest.phases[phase] = value
      dirty = true
      return value
    },
  }
}
