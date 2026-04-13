import type { IRegistryBuildExtension } from '../extensions/extension'
import type {
  IRegistryBuildColorsConfig,
  IRegistryBuildComponentIndex,
  IRegistryBuildContentRewrite,
  IRegistryBuildCssTemplates,
  IRegistryBuildThemeEntry,
  IRegistryBuildThemesConfig,
  RegistryBuildFramework,
} from '../extensions/ui/ui.config.types'
import type { IRegistryEntry, RegistryItemType, RegistryItemTypeMap } from '../extensions/ui/ui.registry.types'

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
export interface IRegistryBuildSource {
  glob?: string
  ignore?: string[]
  indexStrategy?: 'item' | 'file'
  packageName?: string
  path: string
  referencePath?: string
}

/** Generic collection definition used by the collection-first API. */
export interface IRegistryBuildCollection {
  data?: unknown | string
  metadata?: Record<string, unknown>
  sources?: Record<string, IRegistryBuildSource>
}

/**
 * Minimal core output config. Domain-specific output paths belong to the
 * extension that emits them.
 */
export interface IRegistryBuildOutput {
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
export interface IRegistryBuildImportMappings<TType extends RegistryItemType = RegistryItemType> {
  contentRewrites?: IRegistryBuildContentRewrite[]
  packageMappings?: RegistryItemTypeMap<string, TType>
}

/** Performance tuning knobs shared by the cache and runner. */
export interface IRegistryBuildPerformanceConfig {
  cacheDir?: string
  incremental?: boolean
  parallelism?: number
}

/** Human-facing branding used in CLI output. */
export interface IRegistryBuildBranding {
  font?: string
  name?: string
}

/** Declared schema config for registry item types. */
export interface IRegistryBuildSchemaConfig<TType extends RegistryItemType = RegistryItemType> {
  itemTypes?: TType[]
}

/** Public configuration surface for the generic builder core. */
export interface IRegistryBuildConfig {
  branding?: IRegistryBuildBranding
  collections?: Record<string, IRegistryBuildCollection>
  colors?: IRegistryBuildColorsConfig
  componentIndex?: IRegistryBuildComponentIndex
  cssTemplates?: IRegistryBuildCssTemplates
  extensions?: IRegistryBuildExtension[]
  extends?: string | string[]
  importMappings?: IRegistryBuildImportMappings
  output?: IRegistryBuildOutput
  performance?: IRegistryBuildPerformanceConfig
  registries?: Record<string, IRegistryEntry[]>
  registrySource?: 'inline' | string
  schema?: IRegistryBuildSchemaConfig
  sources?: RegistryItemTypeMap<IRegistryBuildSource>
  stripVariables?: string[]
  targetPaths?: RegistryItemTypeMap<string>
  themes?: IRegistryBuildThemesConfig
}

// ---------------------------------------------------------------------------
// Resolved types (consumed by the runtime pipeline)
// ---------------------------------------------------------------------------

/** Source config after defaults and path resolution have been applied. */
export interface IResolvedRegistryBuildSource extends IRegistryBuildSource {
  glob: string
  ignore: string[]
  indexStrategy: 'item' | 'file'
  path: string
}

/** Collection config after loader materialization. */
export interface IResolvedRegistryBuildCollection {
  data?: unknown
  metadata: Record<string, unknown>
  sources: Record<string, IResolvedRegistryBuildSource>
}

/** Output config after loader defaults have been applied. */
export interface IResolvedRegistryBuildOutput extends IRegistryBuildOutput {
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
export interface IResolvedRegistryBuildImportMappings<TType extends RegistryItemType = RegistryItemType>
  extends IRegistryBuildImportMappings<TType> {
  contentRewrites: IRegistryBuildContentRewrite[]
  packageMappings: RegistryItemTypeMap<string, TType>
}

/** Component index config after defaults have been applied. */
export interface IResolvedRegistryBuildComponentIndex<TType extends RegistryItemType = RegistryItemType>
  extends IRegistryBuildComponentIndex<TType> {
  excludeTypes: TType[]
  framework: RegistryBuildFramework
  header: string
  ssr: boolean
}

/** CSS template config after defaults have been applied. */
export interface IResolvedRegistryBuildCssTemplates extends IRegistryBuildCssTemplates {
  baseLayerRules: string
  baseStyles: string
}

/** Performance config after defaults have been applied. */
export interface IResolvedRegistryBuildPerformanceConfig extends IRegistryBuildPerformanceConfig {
  cacheDir: string
  incremental: boolean
  parallelism: number
}

/** Branding config after defaults have been applied. */
export interface IResolvedRegistryBuildBranding extends IRegistryBuildBranding {
  font: string
  name: string
}

/** Schema config after defaults and compatibility inference. */
export interface IResolvedRegistryBuildSchemaConfig<TType extends RegistryItemType = RegistryItemType>
  extends IRegistryBuildSchemaConfig<TType> {
  itemTypes: TType[]
}

/** Theme config after defaults have been applied. */
export interface IResolvedRegistryBuildThemesConfig extends IRegistryBuildThemesConfig {
  cssVarKeys: string[]
  data?: Record<string, IRegistryBuildThemeEntry>
  defaultRadius: string
  names: string[]
}

/** Fully resolved config consumed by the runtime pipeline. */
export interface IResolvedRegistryBuildConfig
  extends Omit<
    IRegistryBuildConfig,
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
  collections: Record<string, IResolvedRegistryBuildCollection>
  colors?: {
    data?: Record<string, unknown>
  }
  componentIndex: IResolvedRegistryBuildComponentIndex
  cssTemplates: IResolvedRegistryBuildCssTemplates
  extensions: IRegistryBuildExtension[]
  importMappings: IResolvedRegistryBuildImportMappings
  output: IResolvedRegistryBuildOutput
  performance: IResolvedRegistryBuildPerformanceConfig
  registries: Record<string, IRegistryEntry[]>
  registrySource: 'inline' | string
  schema: IResolvedRegistryBuildSchemaConfig
  sources: RegistryItemTypeMap<IResolvedRegistryBuildSource>
  stripVariables: string[]
  targetPaths: RegistryItemTypeMap<string>
  themes?: IResolvedRegistryBuildThemesConfig
}
