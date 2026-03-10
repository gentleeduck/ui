import type { RegistryBuildExtension } from './extensions/types'

export type RegistryItemType = `registry:${string}`

export type RegistryItemTypeMap<TValue, TType extends RegistryItemType = RegistryItemType> = Partial<
  Record<TType, TValue>
>

export interface RegistryItemFile<TType extends RegistryItemType = RegistryItemType> {
  content?: string
  path: string
  target?: string
  type: TType
}

export interface RegistryItemTailwindConfig {
  content?: string[]
  plugins?: string[]
  theme?: Record<string, unknown>
}

export interface RegistryItemTailwind {
  config: RegistryItemTailwindConfig
}

export interface RegistryItemCssVars {
  dark?: Record<string, string>
  light?: Record<string, string>
}

export interface RegistryEntry<TType extends RegistryItemType = RegistryItemType> {
  categories?: string[]
  cssVars?: RegistryItemCssVars
  dependencies?: string[]
  description?: string
  devDependencies?: string[]
  files?: RegistryItemFile<TType>[]
  name: string
  registryDependencies?: string[]
  root_folder: string
  source?: string
  tailwind?: RegistryItemTailwind
  type: TType
  [key: string]: unknown
}

export interface RegistryBuildSource {
  glob?: string
  ignore?: string[]
  indexStrategy?: 'item' | 'file'
  packageName?: string
  path: string
  referencePath?: string
}

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

export interface RegistryBuildContentRewrite {
  pattern: string
  replacement: string
}

export interface RegistryBuildImportMappings<TType extends RegistryItemType = RegistryItemType> {
  contentRewrites?: RegistryBuildContentRewrite[]
  packageMappings?: RegistryItemTypeMap<string, TType>
}

export type RegistryBuildFramework = 'nextjs' | 'vite' | 'astro' | 'custom'

export interface RegistryBuildComponentIndex<TType extends RegistryItemType = RegistryItemType> {
  excludeTypes?: TType[]
  framework?: RegistryBuildFramework
  generator?: (items: RegistryEntry[]) => string
  header?: string
  ssr?: boolean
}

export interface RegistryBuildThemeEntry {
  dark: Record<string, string>
  label: string
  light: Record<string, string>
  radius: string
}

export interface RegistryBuildColorsConfig {
  data?: Record<string, unknown> | string
}

export interface RegistryBuildThemesConfig {
  cssVarKeys?: string[]
  data?: Record<string, RegistryBuildThemeEntry> | string
  defaultRadius?: string
  names?: string[]
}

export interface RegistryBuildCssTemplates {
  baseLayerRules?: string
  baseStyles?: string
}

export interface RegistryBuildPipelineConfig {
  components?: boolean
  index?: boolean
}

export interface RegistryBuildBranding {
  font?: string
  name?: string
}

export interface RegistryBuildSchemaConfig<TType extends RegistryItemType = RegistryItemType> {
  itemTypes?: TType[]
}

export interface RegistryBuildConfig<TType extends RegistryItemType = RegistryItemType> {
  extends?: string | string[]
  branding?: RegistryBuildBranding
  colors?: RegistryBuildColorsConfig
  componentIndex?: RegistryBuildComponentIndex<TType>
  cssTemplates?: RegistryBuildCssTemplates
  extensions?: RegistryBuildExtension[]
  importMappings?: RegistryBuildImportMappings<TType>
  output?: RegistryBuildOutput
  pipeline?: RegistryBuildPipelineConfig
  registries?: Record<string, RegistryEntry<TType>[]>
  registrySource?: 'inline' | string
  schema?: RegistryBuildSchemaConfig<TType>
  sources?: RegistryItemTypeMap<RegistryBuildSource, TType>
  stripVariables?: string[]
  targetPaths?: RegistryItemTypeMap<string, TType>
  themes?: RegistryBuildThemesConfig
}

export interface ResolvedRegistryBuildSource extends RegistryBuildSource {
  glob: string
  ignore: string[]
  indexStrategy: 'item' | 'file'
  path: string
}

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

export interface ResolvedRegistryBuildImportMappings<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildImportMappings<TType> {
  contentRewrites: RegistryBuildContentRewrite[]
  packageMappings: RegistryItemTypeMap<string, TType>
}

export interface ResolvedRegistryBuildComponentIndex<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildComponentIndex<TType> {
  excludeTypes: TType[]
  framework: RegistryBuildFramework
  header: string
  ssr: boolean
}

export interface ResolvedRegistryBuildThemesConfig extends RegistryBuildThemesConfig {
  cssVarKeys: string[]
  data?: Record<string, RegistryBuildThemeEntry>
  defaultRadius: string
  names: string[]
}

export interface ResolvedRegistryBuildCssTemplates extends RegistryBuildCssTemplates {
  baseLayerRules: string
  baseStyles: string
}

export interface ResolvedRegistryBuildPipelineConfig extends RegistryBuildPipelineConfig {
  components: boolean
  index: boolean
}

export interface ResolvedRegistryBuildBranding extends RegistryBuildBranding {
  font: string
  name: string
}

export interface ResolvedRegistryBuildSchemaConfig<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildSchemaConfig<TType> {
  itemTypes: TType[]
}

export interface ResolvedRegistryBuildConfig<TType extends RegistryItemType = RegistryItemType>
  extends Omit<
    RegistryBuildConfig<TType>,
    | 'colors'
    | 'componentIndex'
    | 'cssTemplates'
    | 'extensions'
    | 'extends'
    | 'importMappings'
    | 'output'
    | 'pipeline'
    | 'schema'
    | 'sources'
    | 'themes'
  > {
  colors?: {
    data?: Record<string, unknown>
  }
  componentIndex: ResolvedRegistryBuildComponentIndex<TType>
  cssTemplates: ResolvedRegistryBuildCssTemplates
  extensions: RegistryBuildExtension[]
  importMappings: ResolvedRegistryBuildImportMappings<TType>
  output: ResolvedRegistryBuildOutput
  pipeline: ResolvedRegistryBuildPipelineConfig
  registries: Record<string, RegistryEntry<TType>[]>
  registrySource: 'inline' | string
  schema: ResolvedRegistryBuildSchemaConfig<TType>
  sources: RegistryItemTypeMap<ResolvedRegistryBuildSource, TType>
  stripVariables: string[]
  targetPaths: RegistryItemTypeMap<string, TType>
  themes?: ResolvedRegistryBuildThemesConfig
}

export interface LoadedRegistryBuildConfig<TType extends RegistryItemType = RegistryItemType> {
  config: ResolvedRegistryBuildConfig<TType>
  configDir: string
  configPath: string
}

export interface LoadRegistryBuildConfigOptions {
  configFile?: string
  cwd?: string
}
