import type {
  RegistryBuildCollection,
  RegistryBuildConfig,
  RegistryBuildSource,
  RegistryBuildThemeEntry,
  RegistryEntry,
  RegistryItemType,
  RegistryItemTypeMap,
} from '../types'

type ConfigArrayItem<TValue> = TValue extends readonly (infer TItem)[] ? TItem : never
type ConfigRegistryItemTypes<TConfig extends RegistryBuildConfig> =
  | Extract<keyof NonNullable<TConfig['sources']>, RegistryItemType>
  | Extract<keyof NonNullable<TConfig['targetPaths']>, RegistryItemType>
  | Extract<keyof NonNullable<NonNullable<TConfig['importMappings']>['packageMappings']>, RegistryItemType>
  | Extract<ConfigArrayItem<NonNullable<NonNullable<TConfig['componentIndex']>['excludeTypes']>>, RegistryItemType>
  | Extract<ConfigArrayItem<NonNullable<NonNullable<TConfig['schema']>['itemTypes']>>, RegistryItemType>
  | Extract<
      ConfigArrayItem<NonNullable<TConfig['registries']>[keyof NonNullable<TConfig['registries']>]> extends {
        type: infer TType
      }
        ? TType
        : never,
      RegistryItemType
    >

function mergeUniqueStrings<TValue extends string>(left?: TValue[], right?: TValue[]) {
  return [...new Set([...(left ?? []), ...(right ?? [])])] as TValue[]
}

function mergeSources(
  baseSources?: Record<string, RegistryBuildSource | undefined>,
  nextSources?: Record<string, RegistryBuildSource | undefined>,
) {
  const keys = new Set<string>([...Object.keys(baseSources ?? {}), ...Object.keys(nextSources ?? {})])
  const result: Record<string, RegistryBuildSource> = {}

  for (const key of keys) {
    const base = baseSources?.[key]
    const next = nextSources?.[key]

    if (!base && next) {
      result[key] = {
        ...next,
        ignore: next.ignore ? [...next.ignore] : undefined,
      }
      continue
    }

    if (base && !next) {
      result[key] = {
        ...base,
        ignore: base.ignore ? [...base.ignore] : undefined,
      }
      continue
    }

    if (!base || !next) {
      continue
    }

    result[key] = {
      ...base,
      ...next,
      ignore: mergeUniqueStrings(base.ignore, next.ignore),
    }
  }

  return result
}

function mergeCollectionData(baseData?: unknown | string, nextData?: unknown | string) {
  if (typeof nextData === 'string') {
    return nextData
  }

  if (typeof baseData === 'string') {
    return nextData ?? baseData
  }

  if (baseData && nextData && !Array.isArray(baseData) && !Array.isArray(nextData)) {
    return {
      ...(baseData as Record<string, unknown>),
      ...(nextData as Record<string, unknown>),
    }
  }

  return nextData ?? baseData
}

function mergeCollections(
  baseCollections?: Record<string, RegistryBuildCollection>,
  nextCollections?: Record<string, RegistryBuildCollection>,
) {
  const keys = new Set([...Object.keys(baseCollections ?? {}), ...Object.keys(nextCollections ?? {})])
  const result: Record<string, RegistryBuildCollection> = {}

  for (const key of keys) {
    const base = baseCollections?.[key]
    const next = nextCollections?.[key]

    if (!base && next) {
      result[key] = {
        ...next,
        metadata: next.metadata ? { ...next.metadata } : undefined,
        sources: next.sources ? mergeSources(undefined, next.sources) : undefined,
      }
      continue
    }

    if (base && !next) {
      result[key] = {
        ...base,
        metadata: base.metadata ? { ...base.metadata } : undefined,
        sources: base.sources ? mergeSources(base.sources, undefined) : undefined,
      }
      continue
    }

    if (!base || !next) {
      continue
    }

    result[key] = {
      ...base,
      ...next,
      data: mergeCollectionData(base.data, next.data),
      metadata: {
        ...(base.metadata ?? {}),
        ...(next.metadata ?? {}),
      },
      sources: mergeSources(base.sources, next.sources),
    }
  }

  return result
}

function mergeRegistries(
  baseRegistries?: Record<string, RegistryEntry[]>,
  nextRegistries?: Record<string, RegistryEntry[]>,
) {
  const keys = new Set([...Object.keys(baseRegistries ?? {}), ...Object.keys(nextRegistries ?? {})])
  const result: Record<string, RegistryEntry[]> = {}

  for (const key of keys) {
    result[key] = [...(baseRegistries?.[key] ?? []), ...(nextRegistries?.[key] ?? [])]
  }

  return result
}

function mergeThemeData(
  baseData?: Record<string, RegistryBuildThemeEntry> | string,
  nextData?: Record<string, RegistryBuildThemeEntry> | string,
) {
  if (typeof nextData === 'string') {
    return nextData
  }

  if (typeof baseData === 'string') {
    return nextData ?? baseData
  }

  if (baseData || nextData) {
    return {
      ...(baseData ?? {}),
      ...(nextData ?? {}),
    }
  }

  return undefined
}

function mergeColorData(baseData?: Record<string, unknown> | string, nextData?: Record<string, unknown> | string) {
  if (typeof nextData === 'string') {
    return nextData
  }

  if (typeof baseData === 'string') {
    return nextData ?? baseData
  }

  if (baseData || nextData) {
    return {
      ...(baseData ?? {}),
      ...(nextData ?? {}),
    }
  }

  return undefined
}

export function mergeRegistryBuildConfigs<
  TBaseConfig extends RegistryBuildConfig,
  TNextConfig extends RegistryBuildConfig,
  TMergedType extends RegistryItemType = Extract<
    ConfigRegistryItemTypes<TBaseConfig> | ConfigRegistryItemTypes<TNextConfig>,
    RegistryItemType
  >,
>(
  baseConfig: TBaseConfig,
  nextConfig: TNextConfig,
): RegistryBuildConfig<[TMergedType] extends [never] ? RegistryItemType : TMergedType> {
  return {
    ...baseConfig,
    ...nextConfig,
    extends: undefined,
    collections: mergeCollections(baseConfig.collections, nextConfig.collections),
    branding:
      baseConfig.branding || nextConfig.branding
        ? {
            ...baseConfig.branding,
            ...nextConfig.branding,
          }
        : undefined,
    colors:
      baseConfig.colors || nextConfig.colors
        ? {
            ...baseConfig.colors,
            ...nextConfig.colors,
            data: mergeColorData(baseConfig.colors?.data, nextConfig.colors?.data),
          }
        : undefined,
    componentIndex:
      baseConfig.componentIndex || nextConfig.componentIndex
        ? {
            ...baseConfig.componentIndex,
            ...nextConfig.componentIndex,
            excludeTypes: mergeUniqueStrings(
              baseConfig.componentIndex?.excludeTypes,
              nextConfig.componentIndex?.excludeTypes,
            ),
          }
        : undefined,
    cssTemplates:
      baseConfig.cssTemplates || nextConfig.cssTemplates
        ? {
            ...baseConfig.cssTemplates,
            ...nextConfig.cssTemplates,
          }
        : undefined,
    extensions: [...(baseConfig.extensions ?? []), ...(nextConfig.extensions ?? [])],
    importMappings:
      baseConfig.importMappings || nextConfig.importMappings
        ? {
            ...baseConfig.importMappings,
            ...nextConfig.importMappings,
            contentRewrites: [
              ...(baseConfig.importMappings?.contentRewrites ?? []),
              ...(nextConfig.importMappings?.contentRewrites ?? []),
            ],
            packageMappings: {
              ...(baseConfig.importMappings?.packageMappings ?? {}),
              ...(nextConfig.importMappings?.packageMappings ?? {}),
            },
          }
        : undefined,
    output:
      baseConfig.output || nextConfig.output
        ? {
            ...baseConfig.output,
            ...nextConfig.output,
          }
        : undefined,
    performance:
      baseConfig.performance || nextConfig.performance
        ? {
            ...baseConfig.performance,
            ...nextConfig.performance,
          }
        : undefined,
    pipeline:
      baseConfig.pipeline || nextConfig.pipeline
        ? {
            ...baseConfig.pipeline,
            ...nextConfig.pipeline,
          }
        : undefined,
    registries: mergeRegistries(baseConfig.registries, nextConfig.registries),
    registrySource: nextConfig.registrySource ?? baseConfig.registrySource,
    schema:
      baseConfig.schema || nextConfig.schema
        ? {
            ...baseConfig.schema,
            ...nextConfig.schema,
            itemTypes: mergeUniqueStrings(baseConfig.schema?.itemTypes, nextConfig.schema?.itemTypes),
          }
        : undefined,
    sources: mergeSources(baseConfig.sources, nextConfig.sources) as RegistryItemTypeMap<RegistryBuildSource>,
    stripVariables: mergeUniqueStrings(baseConfig.stripVariables, nextConfig.stripVariables),
    targetPaths: {
      ...(baseConfig.targetPaths ?? {}),
      ...(nextConfig.targetPaths ?? {}),
    },
    themes:
      baseConfig.themes || nextConfig.themes
        ? {
            ...baseConfig.themes,
            ...nextConfig.themes,
            cssVarKeys: mergeUniqueStrings(baseConfig.themes?.cssVarKeys, nextConfig.themes?.cssVarKeys),
            data: mergeThemeData(baseConfig.themes?.data, nextConfig.themes?.data),
            names: mergeUniqueStrings(baseConfig.themes?.names, nextConfig.themes?.names),
          }
        : undefined,
  } as unknown as RegistryBuildConfig<[TMergedType] extends [never] ? RegistryItemType : TMergedType>
}
