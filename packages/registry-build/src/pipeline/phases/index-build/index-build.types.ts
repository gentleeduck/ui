import type { IndexedRegistryEntry } from '../../../extensions/ui/ui.registry.types'

/**
 * Cached index signature persisted for a single registry entry.
 */
export interface RegistryBuildIndexCacheEntry {
  indexedEntries: IndexedRegistryEntry[]
  signature: string
  staticSignature: string
}

/**
 * Cache state for the index phase.
 */
export interface RegistryBuildIndexCacheState {
  entries: Record<string, RegistryBuildIndexCacheEntry>
}

/**
 * Result of materializing one registry entry for the index phase.
 */
export interface RegistryBuildMaterializedEntry {
  cacheEntry: RegistryBuildIndexCacheEntry
  cacheKey: string
  indexedEntries: IndexedRegistryEntry[]
  rebuilt: boolean
}
