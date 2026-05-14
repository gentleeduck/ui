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

/**
 * Filesystem-backed source root. The source name is intentionally generic;
 * extensions interpret it (registry item type, package channel, etc).
 */
export interface IRegistryBuildSource {
  glob?: string
  ignore?: string[]
  indexStrategy?: 'item' | 'file'
  packageName?: string
  path: string
  referencePath?: string
}

export interface IRegistryBuildCollection {
  data?: unknown | string
  metadata?: Record<string, unknown>
  sources?: Record<string, IRegistryBuildSource>
}

// Domain-specific output paths live with the extension that emits them.
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

export interface IRegistryBuildImportMappings<TType extends RegistryItemType = RegistryItemType> {
  contentRewrites?: IRegistryBuildContentRewrite[]
  packageMappings?: RegistryItemTypeMap<string, TType>
}

export interface IRegistryBuildPerformanceConfig {
  cacheDir?: string
  incremental?: boolean
  parallelism?: number
}

export interface IRegistryBuildBranding {
  font?: string
  name?: string
}

export interface IRegistryBuildSchemaConfig<TType extends RegistryItemType = RegistryItemType> {
  itemTypes?: TType[]
}

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

export interface IResolvedRegistryBuildSource extends IRegistryBuildSource {
  glob: string
  ignore: string[]
  indexStrategy: 'item' | 'file'
  path: string
}

export interface IResolvedRegistryBuildCollection {
  data?: unknown
  metadata: Record<string, unknown>
  sources: Record<string, IResolvedRegistryBuildSource>
}

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

export interface IResolvedRegistryBuildImportMappings<TType extends RegistryItemType = RegistryItemType>
  extends IRegistryBuildImportMappings<TType> {
  contentRewrites: IRegistryBuildContentRewrite[]
  packageMappings: RegistryItemTypeMap<string, TType>
}

export interface IResolvedRegistryBuildComponentIndex<TType extends RegistryItemType = RegistryItemType>
  extends IRegistryBuildComponentIndex<TType> {
  excludeTypes: TType[]
  framework: RegistryBuildFramework
  header: string
  ssr: boolean
}

export interface IResolvedRegistryBuildCssTemplates extends IRegistryBuildCssTemplates {
  baseLayerRules: string
  baseStyles: string
}

export interface IResolvedRegistryBuildPerformanceConfig extends IRegistryBuildPerformanceConfig {
  cacheDir: string
  incremental: boolean
  parallelism: number
}

export interface IResolvedRegistryBuildBranding extends IRegistryBuildBranding {
  font: string
  name: string
}

export interface IResolvedRegistryBuildSchemaConfig<TType extends RegistryItemType = RegistryItemType>
  extends IRegistryBuildSchemaConfig<TType> {
  itemTypes: TType[]
}

export interface IResolvedRegistryBuildThemesConfig extends IRegistryBuildThemesConfig {
  cssVarKeys: string[]
  data?: Record<string, IRegistryBuildThemeEntry>
  defaultRadius: string
  names: string[]
}

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
