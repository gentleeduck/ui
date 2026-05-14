import type { Project } from 'ts-morph'
import type { ILoadedRegistryBuildConfig, ILoadRegistryBuildConfigOptions } from '../config/loader/loader.types'
import type { IResolvedRegistryBuildConfig } from '../config/types'
import type { IRegistryBuildCacheStore } from './cache/cache'

export interface IRegistryBuildOutputPaths {
  baseDir: string
  cacheDir: string
  cacheFile: string
  colorsDir: string
  componentIndexDir: string
  componentIndexFile: string
  componentsDir: string
  indexFile: string
  registryDir: string
  themesCssFile: string
  themesDir: string
}

export interface IRegistryBuildPathRegistry {
  baseDir: string
  named: Record<string, string>
}

export interface IRegistryBuildOutputRecord {
  metadata?: Record<string, unknown>
  name: string
  paths: string[]
}

export interface IRegistryBuildArtifacts {
  [key: string]: unknown
}

export interface IRegistryBuildContext extends Omit<ILoadedRegistryBuildConfig, 'config'> {
  artifacts: IRegistryBuildArtifacts
  cache: IRegistryBuildCacheStore
  changedOnly: boolean
  changedPaths: string[]
  config: IResolvedRegistryBuildConfig
  cwd: string
  getArtifact: <TValue = unknown>(name: string) => TValue | undefined
  getOutput: (name: string) => IRegistryBuildOutputRecord | undefined
  getPath: (name: string) => string
  listOutputs: () => IRegistryBuildOutputRecord[]
  outputPaths: IRegistryBuildOutputPaths
  outputs: IRegistryBuildOutputRecord[]
  paths: IRegistryBuildPathRegistry
  project: Project
  registerOutput: (
    name: string,
    paths: string | string[],
    metadata?: Record<string, unknown>,
  ) => IRegistryBuildOutputRecord
  setArtifact: <TValue>(name: string, value: TValue) => TValue
  silent: boolean
}

export interface IRegistryBuildPhaseResult {
  details?: string
  itemCount?: number
  name: string
  outputFiles?: string[]
  skipped?: boolean
}

export interface IBuildOptions extends ILoadRegistryBuildConfigOptions {
  changedOnly?: boolean
  changedPaths?: string[]
  silent?: boolean
}

export interface IBuildResult {
  artifacts: IRegistryBuildArtifacts
  configPath: string
  outputPaths: IRegistryBuildOutputPaths
  outputs: IRegistryBuildOutputRecord[]
  paths: IRegistryBuildPathRegistry
  phaseResults: IRegistryBuildPhaseResult[]
}
