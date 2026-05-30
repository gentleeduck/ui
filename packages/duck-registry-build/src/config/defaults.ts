import { availableParallelism } from 'node:os'
import { NEXTJS_COMPONENT_INDEX_HEADER } from '../adapters/component-index/nextjs'
import type { RegistryBuildFramework } from '../extensions/ui/ui.config.types'
import type { RegistryItemType, RegistryItemTypeMap } from '../extensions/ui/ui.registry.types'
import type {
  IRegistryBuildCollection,
  IRegistryBuildConfig,
  IRegistryBuildSource,
  IResolvedRegistryBuildBranding,
  IResolvedRegistryBuildComponentIndex,
  IResolvedRegistryBuildCssTemplates,
  IResolvedRegistryBuildOutput,
  IResolvedRegistryBuildPerformanceConfig,
} from './types'

export const DEFAULT_CONFIG_FILENAMES = [
  'registry-build.config.ts',
  'registry-build.config.mts',
  'registry-build.config.cts',
  'registry-build.config.js',
  'registry-build.config.mjs',
  'registry-build.config.cjs',
  'registry-build.config.json',
] as const

export const DEFAULT_SOURCE_GLOB = '**/*.{ts,tsx}'
// Extensions the component-index phase considers as "the primary file" when
// resolving the entry-point for a dynamic import. Kept alongside the source
// glob so adding a primary extension here is the only edit needed.
export const PRIMARY_FILE_EXTENSIONS = ['.ts', '.tsx'] as const
export const DEFAULT_SOURCE_INDEX_STRATEGY = 'item' as const
export const DEFAULT_SOURCE_IGNORE = [
  '**/__test__/**',
  '**/__tests__/**',
  '**/__snapshots__/**',
  '**/*.test.*',
  '**/*.spec.*',
] as const

export const DEFAULT_STRIP_VARIABLES = [] as const
export const DEFAULT_COMPONENT_INDEX_EXCLUDE_TYPES = [] as const
export const DEFAULT_COMPONENT_INDEX_FRAMEWORK: RegistryBuildFramework = 'nextjs'
// Default header is the Nextjs adapter header (the default framework). Re-exported
// so the phase-level fallback compares against the same literal the adapter emits.
export const DEFAULT_COMPONENT_INDEX_HEADER = NEXTJS_COMPONENT_INDEX_HEADER

export const DEFAULT_THEME_CSS_VAR_KEYS = [] as const
export const DEFAULT_THEME_NAMES = [] as const
export const DEFAULT_THEME_RADIUS = '0.5rem'

export const DEFAULT_OUTPUT: Omit<IResolvedRegistryBuildOutput, 'dir'> = {
  colorsDir: 'colors',
  componentIndexDir: '__ui_registry__',
  componentIndexFile: 'index.tsx',
  componentsDir: 'components',
  registryDir: 'public/r',
  themesCssFile: 'themes.css',
  themesDir: 'themes',
}

export const DEFAULT_COMPONENT_INDEX: Omit<IResolvedRegistryBuildComponentIndex, 'generator'> = {
  excludeTypes: [...DEFAULT_COMPONENT_INDEX_EXCLUDE_TYPES],
  framework: DEFAULT_COMPONENT_INDEX_FRAMEWORK,
  header: DEFAULT_COMPONENT_INDEX_HEADER,
  ssr: false,
}

export const DEFAULT_PERFORMANCE: IResolvedRegistryBuildPerformanceConfig = {
  cacheDir: '.registry-build',
  incremental: true,
  parallelism: Math.max(1, Math.min(availableParallelism(), 8)),
}

export const DEFAULT_BRANDING: IResolvedRegistryBuildBranding = {
  font: 'ANSI Shadow',
  name: '@gentleduck/registry-build',
}

export const DEFAULT_CSS_TEMPLATES: IResolvedRegistryBuildCssTemplates = {
  baseLayerRules: `@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`,
  baseStyles: `@tailwind base;
@tailwind components;
@tailwind utilities;
  `,
}

export const DEFAULT_SCHEMA_ITEM_TYPES = [] as const

// `ignore` is force-merged with DEFAULT_SOURCE_IGNORE so user arrays cannot opt
// out of the test/snapshot exclusions.
function withSourceDefaults(source: IRegistryBuildSource): IRegistryBuildSource {
  const userIgnore = source.ignore ?? []
  return {
    ...source,
    glob: source.glob ?? DEFAULT_SOURCE_GLOB,
    ignore: [...new Set([...DEFAULT_SOURCE_IGNORE, ...userIgnore])],
    indexStrategy: source.indexStrategy ?? DEFAULT_SOURCE_INDEX_STRATEGY,
  }
}

function withCollectionDefaults(collection: IRegistryBuildCollection): IRegistryBuildCollection {
  return {
    ...collection,
    metadata: collection.metadata ?? {},
    sources: Object.fromEntries(
      Object.entries(collection.sources ?? {}).map(([name, source]) => [name, withSourceDefaults(source)]),
    ),
  }
}

/**
 * Single source of truth for default values. No path resolution or file IO;
 * resolution and the loader rely on fields being fully populated after this runs.
 */
export function withRegistryBuildDefaults(config: IRegistryBuildConfig): IRegistryBuildConfig {
  const collectionEntries = Object.entries(config.collections ?? {}) as Array<[string, IRegistryBuildCollection]>
  const sourceEntries = Object.entries(config.sources ?? {}) as Array<[RegistryItemType, IRegistryBuildSource]>

  return {
    ...config,
    branding: {
      ...DEFAULT_BRANDING,
      ...config.branding,
    },
    collections: Object.fromEntries(
      collectionEntries.map(([name, collection]) => [name, withCollectionDefaults(collection)]),
    ),
    componentIndex: {
      ...DEFAULT_COMPONENT_INDEX,
      ...config.componentIndex,
      excludeTypes: config.componentIndex?.excludeTypes ?? [...DEFAULT_COMPONENT_INDEX.excludeTypes],
    },
    cssTemplates: {
      ...DEFAULT_CSS_TEMPLATES,
      ...config.cssTemplates,
    },
    extensions: config.extensions ?? [],
    importMappings: {
      contentRewrites: config.importMappings?.contentRewrites ?? [],
      packageMappings: config.importMappings?.packageMappings ?? {},
    },
    output: config.output
      ? {
          ...DEFAULT_OUTPUT,
          ...config.output,
        }
      : undefined,
    performance: {
      ...DEFAULT_PERFORMANCE,
      ...config.performance,
    },
    registries: config.registries ?? {},
    registrySource: config.registrySource ?? 'inline',
    schema: {
      itemTypes: config.schema?.itemTypes ?? [...DEFAULT_SCHEMA_ITEM_TYPES],
    },
    sources: Object.fromEntries(
      sourceEntries.map(([type, source]) => [type, withSourceDefaults(source)]),
    ) as RegistryItemTypeMap<IRegistryBuildSource>,
    stripVariables: config.stripVariables ?? [...DEFAULT_STRIP_VARIABLES],
    targetPaths: config.targetPaths ?? {},
    themes: config.themes
      ? {
          ...config.themes,
          cssVarKeys: config.themes.cssVarKeys ?? [...DEFAULT_THEME_CSS_VAR_KEYS],
          defaultRadius: config.themes.defaultRadius ?? DEFAULT_THEME_RADIUS,
          names: config.themes.names ?? [...DEFAULT_THEME_NAMES],
        }
      : undefined,
  }
}
