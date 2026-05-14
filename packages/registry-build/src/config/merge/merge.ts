import type { IRegistryEntry } from '../../extensions/ui/ui.registry.types'
import type { IRegistryBuildConfig } from '../types'
import { mergeCollections, mergeRecordOrString, mergeSources, mergeUniqueStrings } from './merge.lib'

function mergeRegistries(
  baseRegistries?: Record<string, IRegistryEntry[]>,
  nextRegistries?: Record<string, IRegistryEntry[]>,
) {
  const keys = new Set([...Object.keys(baseRegistries ?? {}), ...Object.keys(nextRegistries ?? {})])
  const result: Record<string, IRegistryEntry[]> = {}

  for (const key of keys) {
    result[key] = [...(baseRegistries?.[key] ?? []), ...(nextRegistries?.[key] ?? [])]
  }

  return result
}

export function mergeRegistryBuildConfigs(
  baseConfig: IRegistryBuildConfig,
  nextConfig: IRegistryBuildConfig,
): IRegistryBuildConfig {
  return {
    ...baseConfig,
    ...nextConfig,
    extends: undefined,
    branding:
      baseConfig.branding || nextConfig.branding
        ? {
            ...baseConfig.branding,
            ...nextConfig.branding,
          }
        : undefined,
    collections: mergeCollections(baseConfig.collections, nextConfig.collections),
    colors:
      baseConfig.colors || nextConfig.colors
        ? {
            ...baseConfig.colors,
            ...nextConfig.colors,
            data: mergeRecordOrString(baseConfig.colors?.data, nextConfig.colors?.data),
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
    sources: mergeSources(baseConfig.sources, nextConfig.sources),
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
            data: mergeRecordOrString(baseConfig.themes?.data, nextConfig.themes?.data),
            names: mergeUniqueStrings(baseConfig.themes?.names, nextConfig.themes?.names),
          }
        : undefined,
  }
}
