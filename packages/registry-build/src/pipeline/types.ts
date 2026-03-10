import type { Project } from 'ts-morph'
import type { LoadedRegistryBuildConfig, LoadRegistryBuildConfigOptions } from '../config/loader/loader.types'
import type { ResolvedRegistryBuildConfig } from '../config/types'
import type { RegistryBuildCacheStore } from './cache/cache'

/**
 * Pipeline-owned runtime types live beside the pipeline implementation so the
 * orchestration layer does not depend on a separate shared type bucket.
 */

/**
 * Normalized output paths used by the core pipeline and UI extensions.
 */
export interface RegistryBuildOutputPaths {
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

export interface RegistryBuildPathRegistry {
  baseDir: string
  named: Record<string, string>
}

export interface RegistryBuildOutputRecord {
  metadata?: Record<string, unknown>
  name: string
  paths: string[]
}

export interface RegistryBuildArtifacts {
  [key: string]: unknown
}

/**
 * Runtime state shared by core phases and extensions.
 */
export interface RegistryBuildContext extends Omit<LoadedRegistryBuildConfig, 'config'> {
  artifacts: RegistryBuildArtifacts
  cache: RegistryBuildCacheStore
  changedOnly: boolean
  changedPaths: string[]
  config: ResolvedRegistryBuildConfig
  cwd: string
  getArtifact: <TValue = unknown>(name: string) => TValue | undefined
  getOutput: (name: string) => RegistryBuildOutputRecord | undefined
  getPath: (name: string) => string
  listOutputs: () => RegistryBuildOutputRecord[]
  outputPaths: RegistryBuildOutputPaths
  outputs: RegistryBuildOutputRecord[]
  paths: RegistryBuildPathRegistry
  project: Project
  registerOutput: (
    name: string,
    paths: string | string[],
    metadata?: Record<string, unknown>,
  ) => RegistryBuildOutputRecord
  setArtifact: <TValue>(name: string, value: TValue) => TValue
  silent: boolean
}

export interface RegistryBuildPhaseResult {
  details?: string
  itemCount?: number
  name: string
  outputFiles?: string[]
  skipped?: boolean
}

export interface BuildOptions extends LoadRegistryBuildConfigOptions {
  changedOnly?: boolean
  changedPaths?: string[]
  silent?: boolean
}

export interface BuildResult {
  artifacts: RegistryBuildArtifacts
  configPath: string
  outputPaths: RegistryBuildOutputPaths
  outputs: RegistryBuildOutputRecord[]
  paths: RegistryBuildPathRegistry
  phaseResults: RegistryBuildPhaseResult[]
}
