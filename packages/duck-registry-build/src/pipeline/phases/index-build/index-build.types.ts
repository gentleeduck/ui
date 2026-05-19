import type { IIndexedRegistryEntry } from '../../../extensions/ui/ui.registry.types'

export interface IRegistryBuildIndexCacheEntry {
  indexedEntries: IIndexedRegistryEntry[]
  signature: string
  staticSignature: string
}

export interface IRegistryBuildIndexCacheState {
  entries: Record<string, IRegistryBuildIndexCacheEntry>
}

export interface IRegistryBuildMaterializedEntry {
  cacheEntry: IRegistryBuildIndexCacheEntry
  cacheKey: string
  indexedEntries: IIndexedRegistryEntry[]
  rebuilt: boolean
}
