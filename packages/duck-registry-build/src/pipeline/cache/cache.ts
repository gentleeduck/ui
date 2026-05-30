import fs from 'node:fs/promises'
import { z } from 'zod'
import { pathExists, writeJsonIfChanged } from '../../lib/fs'
import { hashString } from '../../lib/hash'
import { normalizeSlashes } from '../../lib/path'
import { phasesCacheSchema } from './cache.schemas'

const REGISTRY_BUILD_CACHE_VERSION = 1

interface IRegistryBuildFileHashRecord {
  hash: string
  mtimeMs: number
  size: number
}

interface IRegistryBuildCacheManifest {
  fileHashes: Record<string, IRegistryBuildFileHashRecord>
  phases: z.infer<typeof phasesCacheSchema>
  version: number
}

// A tampered cache file (committed-by-mistake, hostile, or just outdated) can
// pollute phase outputs because `getPhaseData` returns whatever it finds. Run
// the parsed JSON through a Zod schema — including per-phase payload shapes
// (see `cache.schemas.ts`) — so we discard and rebuild on mismatch instead of
// silently emitting bad output. The per-phase schemas matter because the
// `outputFiles` arrays they pin flow into `removeStaleFiles` → `fs.rm`.
const cacheManifestSchema = z.object({
  fileHashes: z.record(
    z.string(),
    z.object({
      hash: z.string(),
      mtimeMs: z.number(),
      size: z.number(),
    }),
  ),
  phases: phasesCacheSchema,
  version: z.number(),
})

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

async function readCacheManifest(filePath: string): Promise<IRegistryBuildCacheManifest> {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    const parsed = cacheManifestSchema.safeParse(JSON.parse(content))
    if (!parsed.success) {
      // Surface the rejection so a tampered or out-of-shape cache is visible
      // instead of silently triggering a full rebuild. We still fall through
      // to an empty manifest — never trust the unparsed payload.
      console.warn(`[registry-build] cache manifest at ${filePath} failed schema validation; ignoring it.`)
      return createEmptyManifest()
    }
    return parsed.data as IRegistryBuildCacheManifest
  } catch {
    return createEmptyManifest()
  }
}

/** Create a cache store that persists file hashes and phase data to disk for incremental rebuilds. */
export async function createRegistryBuildCache(options: {
  enabled: boolean
  filePath: string
}): Promise<IRegistryBuildCacheStore> {
  const manifest =
    options.enabled && (await pathExists(options.filePath))
      ? await readCacheManifest(options.filePath)
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
    // Returning `unknown` (vs the old `as never`) means callers can pass a
    // generic but TS won't silently widen the result back to that generic at
    // the call site — they have to cast or validate. Both `getPhaseData<T>`
    // callers in-tree handle this correctly via internal cache state schemas.
    // The cast to a generic record is intentional: the public API takes a
    // string phase name (extensions can register their own), but the in-tree
    // phases are schema-validated on load via `phasesCacheSchema`.
    getPhaseData: <TValue>(phase: string) =>
      (cacheManifest.phases as Record<string, unknown>)[phase] as TValue | undefined,
    save: async () => {
      if (!options.enabled || !dirty) {
        return
      }

      await writeJsonIfChanged(options.filePath, cacheManifest)
      dirty = false
    },
    setPhaseData: (phase, value) => {
      ;(cacheManifest.phases as Record<string, unknown>)[phase] = value
      dirty = true
      return value
    },
  }
}
