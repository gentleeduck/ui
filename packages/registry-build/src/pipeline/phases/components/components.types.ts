/**
 * Cached component signature persisted between builds.
 */
export interface IRegistryBuildComponentsCacheEntry {
  outputFile: string
  signature: string
  staticSignature: string
}

/**
 * Cache state for the components phase.
 */
export interface IRegistryBuildComponentsCacheState {
  entries: Record<string, IRegistryBuildComponentsCacheEntry>
  outputFiles: string[]
}
