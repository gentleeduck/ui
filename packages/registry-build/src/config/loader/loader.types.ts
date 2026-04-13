import type { IResolvedRegistryBuildConfig } from '../types'

/**
 * Loader return value pairing the resolved config with its filesystem origin.
 */
export interface ILoadedRegistryBuildConfig {
  config: IResolvedRegistryBuildConfig
  configDir: string
  configPath: string
}

/**
 * Inputs accepted by config discovery and loading helpers.
 */
export interface ILoadRegistryBuildConfigOptions {
  configFile?: string
  cwd?: string
}
