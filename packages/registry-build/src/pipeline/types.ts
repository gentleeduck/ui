import type { Project } from 'ts-morph'
import type { RegistryFileTreeNode } from '../lib/file-tree'
import type { RegistryBuildCacheStore } from './cache'
import type {
  LoadedRegistryBuildConfig,
  LoadRegistryBuildConfigOptions,
  RegistryEntry,
  ResolvedRegistryBuildConfig,
} from '../types'

export interface IndexedRegistryEntry extends RegistryEntry {
  source?: string
  tree?: RegistryFileTreeNode[]
}

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

export interface RegistryBuildContext extends LoadedRegistryBuildConfig {
  artifacts: RegistryBuildArtifacts
  cache: RegistryBuildCacheStore
  changedOnly: boolean
  changedPaths: string[]
  cwd: string
  getArtifact: <TValue = unknown>(name: string) => TValue | undefined
  getOutput: (name: string) => RegistryBuildOutputRecord | undefined
  getPath: (name: string) => string
  listOutputs: () => RegistryBuildOutputRecord[]
  outputPaths: RegistryBuildOutputPaths
  outputs: RegistryBuildOutputRecord[]
  paths: RegistryBuildPathRegistry
  project: Project
  registerOutput: (name: string, paths: string | string[], metadata?: Record<string, unknown>) => RegistryBuildOutputRecord
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
  phaseOverrides?: Partial<ResolvedRegistryBuildConfig['pipeline']>
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
