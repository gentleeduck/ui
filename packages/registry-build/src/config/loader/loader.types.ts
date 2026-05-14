import type { IResolvedRegistryBuildConfig } from '../types'

export interface ILoadedRegistryBuildConfig {
  config: IResolvedRegistryBuildConfig
  configDir: string
  configPath: string
}

export interface ILoadRegistryBuildConfigOptions {
  configFile?: string
  cwd?: string
}
