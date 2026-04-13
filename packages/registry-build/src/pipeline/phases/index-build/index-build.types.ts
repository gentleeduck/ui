import type { IIndexedRegistryEntry } from '../../../extensions/ui/ui.registry.types'

/**
 * Cached index signature persisted for a single registry entry.
 */
export interface IRegistryBuildIndexCacheEntry {
  indexedEntries: IIndexedRegistryEntry[]
  signature: string
  staticSignature: string
}

/**
 * Cache state for the index phase.
 */
export interface IRegistryBuildIndexCacheState {
  entries: Record<string, IRegistryBuildIndexCacheEntry>
}

/**
 * Result of materializing one registry entry for the index phase.
 */
export interface IRegistryBuildMaterializedEntry {
  cacheEntry: IRegistryBuildIndexCacheEntry
  cacheKey: string
  indexedEntries: IIndexedRegistryEntry[]
  rebuilt: boolean
}
