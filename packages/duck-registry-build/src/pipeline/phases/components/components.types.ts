export interface IRegistryBuildComponentsCacheEntry {
  outputFile: string
  signature: string
  staticSignature: string
}

export interface IRegistryBuildComponentsCacheState {
  entries: Record<string, IRegistryBuildComponentsCacheEntry>
  outputFiles: string[]
}
