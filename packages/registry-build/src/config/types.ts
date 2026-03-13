import type { RegistryBuildExtension } from '../extensions/extension'
import type {
  RegistryBuildColorsConfig,
  RegistryBuildComponentIndex,
  RegistryBuildContentRewrite,
  RegistryBuildCssTemplates,
  RegistryBuildFramework,
  RegistryBuildThemeEntry,
  RegistryBuildThemesConfig,
} from '../extensions/ui/ui.config.types'
import type { RegistryEntry, RegistryItemType, RegistryItemTypeMap } from '../extensions/ui/ui.registry.types'

// ---------------------------------------------------------------------------
// Input types (user-facing configuration surface)
// ---------------------------------------------------------------------------

/**
 * A filesystem-backed source root that feeds a collection.
 *
 * The source name is intentionally generic. Extensions are free to interpret
 * it as a registry item type, a repository name, a package channel, or any
 * other domain-specific namespace.
 */
export interface RegistryBuildSource {
  glob?: string
  ignore?: string[]
  indexStrategy?: 'item' | 'file'
  packageName?: string
  path: string
  referencePath?: string
}

/** Generic collection definition used by the collection-first API. */
export interface RegistryBuildCollection {
  data?: unknown | string
  metadata?: Record<string, unknown>
  sources?: Record<string, RegistryBuildSource>
}

/**
 * Minimal core output config. Domain-specific output paths belong to the
 * extension that emits them.
 */
export interface RegistryBuildOutput {
  colorsDir?: string
  componentIndexDir?: string
  componentIndexFile?: string
  componentsDir?: string
  dir?: string
  registryDir?: string
  themesCssFile?: string
  themesDir?: string
}

/** UI-specific import rewriting and package aliasing. */
export interface RegistryBuildImportMappings<TType extends RegistryItemType = RegistryItemType> {
  contentRewrites?: RegistryBuildContentRewrite[]
  packageMappings?: RegistryItemTypeMap<string, TType>
}

/** Performance tuning knobs shared by the cache and runner. */
export interface RegistryBuildPerformanceConfig {
  cacheDir?: string
  incremental?: boolean
  parallelism?: number
}

/** Human-facing branding used in CLI output. */
export interface RegistryBuildBranding {
  font?: string
  name?: string
}

/** Declared schema config for registry item types. */
export interface RegistryBuildSchemaConfig<TType extends RegistryItemType = RegistryItemType> {
  itemTypes?: TType[]
}

/** Public configuration surface for the generic builder core. */
export interface RegistryBuildConfig {
  branding?: RegistryBuildBranding
  collections?: Record<string, RegistryBuildCollection>
  colors?: RegistryBuildColorsConfig
  componentIndex?: RegistryBuildComponentIndex
  cssTemplates?: RegistryBuildCssTemplates
  extensions?: RegistryBuildExtension[]
  extends?: string | string[]
  importMappings?: RegistryBuildImportMappings
  output?: RegistryBuildOutput
  performance?: RegistryBuildPerformanceConfig
  registries?: Record<string, RegistryEntry[]>
  registrySource?: 'inline' | string
  schema?: RegistryBuildSchemaConfig
  sources?: RegistryItemTypeMap<RegistryBuildSource>
  stripVariables?: string[]
  targetPaths?: RegistryItemTypeMap<string>
  themes?: RegistryBuildThemesConfig
}

// ---------------------------------------------------------------------------
// Resolved types (consumed by the runtime pipeline)
// ---------------------------------------------------------------------------

/** Source config after defaults and path resolution have been applied. */
export interface ResolvedRegistryBuildSource extends RegistryBuildSource {
  glob: string
  ignore: string[]
  indexStrategy: 'item' | 'file'
  path: string
}

/** Collection config after loader materialization. */
export interface ResolvedRegistryBuildCollection {
  data?: unknown
  metadata: Record<string, unknown>
  sources: Record<string, ResolvedRegistryBuildSource>
}

/** Output config after loader defaults have been applied. */
export interface ResolvedRegistryBuildOutput extends RegistryBuildOutput {
  colorsDir: string
  componentIndexDir: string
  componentIndexFile: string
  componentsDir: string
  dir: string
  registryDir: string
  themesCssFile: string
  themesDir: string
}

/** Import mappings after defaults have been applied. */
export interface ResolvedRegistryBuildImportMappings<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildImportMappings<TType> {
  contentRewrites: RegistryBuildContentRewrite[]
  packageMappings: RegistryItemTypeMap<string, TType>
}

/** Component index config after defaults have been applied. */
export interface ResolvedRegistryBuildComponentIndex<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildComponentIndex<TType> {
  excludeTypes: TType[]
  framework: RegistryBuildFramework
  header: string
  ssr: boolean
}

/** CSS template config after defaults have been applied. */
export interface ResolvedRegistryBuildCssTemplates extends RegistryBuildCssTemplates {
  baseLayerRules: string
  baseStyles: string
}

/** Performance config after defaults have been applied. */
export interface ResolvedRegistryBuildPerformanceConfig extends RegistryBuildPerformanceConfig {
  cacheDir: string
  incremental: boolean
  parallelism: number
}

/** Branding config after defaults have been applied. */
export interface ResolvedRegistryBuildBranding extends RegistryBuildBranding {
  font: string
  name: string
}

/** Schema config after defaults and compatibility inference. */
export interface ResolvedRegistryBuildSchemaConfig<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildSchemaConfig<TType> {
  itemTypes: TType[]
}

/** Theme config after defaults have been applied. */
export interface ResolvedRegistryBuildThemesConfig extends RegistryBuildThemesConfig {
  cssVarKeys: string[]
  data?: Record<string, RegistryBuildThemeEntry>
  defaultRadius: string
  names: string[]
}

/** Fully resolved config consumed by the runtime pipeline. */
export interface ResolvedRegistryBuildConfig
  extends Omit<
    RegistryBuildConfig,
    | 'collections'
    | 'colors'
    | 'componentIndex'
    | 'cssTemplates'
    | 'extensions'
    | 'importMappings'
    | 'output'
    | 'performance'
    | 'schema'
    | 'sources'
    | 'themes'
  > {
  collections: Record<string, ResolvedRegistryBuildCollection>
  colors?: {
    data?: Record<string, unknown>
  }
  componentIndex: ResolvedRegistryBuildComponentIndex
  cssTemplates: ResolvedRegistryBuildCssTemplates
  extensions: RegistryBuildExtension[]
  importMappings: ResolvedRegistryBuildImportMappings
  output: ResolvedRegistryBuildOutput
  performance: ResolvedRegistryBuildPerformanceConfig
  registries: Record<string, RegistryEntry[]>
  registrySource: 'inline' | string
  schema: ResolvedRegistryBuildSchemaConfig
  sources: RegistryItemTypeMap<ResolvedRegistryBuildSource>
  stripVariables: string[]
  targetPaths: RegistryItemTypeMap<string>
  themes?: ResolvedRegistryBuildThemesConfig
}
