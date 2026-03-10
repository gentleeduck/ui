/**
 * Cached component signature persisted between builds.
 */
export interface RegistryBuildComponentsCacheEntry {
  outputFile: string
  signature: string
  staticSignature: string
}

/**
 * Cache state for the components phase.
 */
export interface RegistryBuildComponentsCacheState {
  entries: Record<string, RegistryBuildComponentsCacheEntry>
  outputFiles: string[]
}
