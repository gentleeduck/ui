import type { ResolvedRegistryBuildConfig } from '../types'

/**
 * Loader return value pairing the resolved config with its filesystem origin.
 */
export interface LoadedRegistryBuildConfig {
  config: ResolvedRegistryBuildConfig
  configDir: string
  configPath: string
}

/**
 * Inputs accepted by config discovery and loading helpers.
 */
export interface LoadRegistryBuildConfigOptions {
  configFile?: string
  cwd?: string
}
