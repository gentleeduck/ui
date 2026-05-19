import path from 'node:path'
import { DEFAULT_THEME_RADIUS, withRegistryBuildDefaults } from '../defaults'
import { resolveFrom } from '../loader/loader.path'
import { loadValueFile } from '../loader/loader.value'
import { mergeRegistryBuildConfigs } from '../merge'
import { registryBuildConfigSchema, registryEntriesSchema, themeEntriesSchema } from '../schema'
import type { IRegistryBuildConfig, IResolvedRegistryBuildCollection, IResolvedRegistryBuildConfig } from '../types'
import {
  deriveDeclaredItemTypes,
  deriveLegacyCollections,
  deriveThemeCssVarKeys,
  resolveCollectionSources,
  resolveSources,
} from './resolution.lib'

function toResolvedConfig(config: IRegistryBuildConfig, configPath: string): IResolvedRegistryBuildConfig {
  const withDefaults = withRegistryBuildDefaults(registryBuildConfigSchema.parse(config))

  if (!withDefaults.output?.dir) {
    throw new Error(`Registry build config at "${configPath}" must define "output.dir" after resolving extends.`)
  }

  const configDir = path.dirname(configPath)
  const registrySource = withDefaults.registrySource ?? 'inline'
  const collections =
    mergeRegistryBuildConfigs(
      {
        collections: deriveLegacyCollections(withDefaults),
      },
      {
        collections: withDefaults.collections ?? {},
      },
    ).collections ?? {}

  // withRegistryBuildDefaults guarantees all optional fields are populated,
  // but TS can't narrow the return type. We cast the result since the
  // defaults function is the single source of truth for required values.
  return {
    ...withDefaults,
    collections: resolveCollectionSources(configDir, collections),
    colors: withDefaults.colors?.data
      ? {
          data: typeof withDefaults.colors.data === 'string' ? undefined : withDefaults.colors.data,
        }
      : undefined,
    output: {
      ...withDefaults.output,
      dir: resolveFrom(configDir, withDefaults.output?.dir ?? '.'),
    },
    registrySource: registrySource === 'inline' ? 'inline' : resolveFrom(configDir, registrySource),
    schema: {
      itemTypes: deriveDeclaredItemTypes(withDefaults),
    },
    sources: resolveSources(configDir, withDefaults.sources ?? {}),
    themes: withDefaults.themes
      ? {
          ...withDefaults.themes,
          data: typeof withDefaults.themes.data === 'string' ? undefined : withDefaults.themes.data,
          defaultRadius: withDefaults.themes.defaultRadius ?? DEFAULT_THEME_RADIUS,
        }
      : undefined,
  } as IResolvedRegistryBuildConfig
}

/**
 * Public resolver used by tests and consumers that construct config objects in
 * memory instead of loading them from disk.
 */
export async function resolveRegistryBuildConfig(
  config: IRegistryBuildConfig,
  options: {
    configPath: string
  },
): Promise<IResolvedRegistryBuildConfig> {
  const resolved = toResolvedConfig(config, options.configPath)
  const configDir = path.dirname(options.configPath)
  let collections = resolved.collections

  if (config.collections) {
    const materializedCollections = Object.fromEntries(
      await Promise.all(
        Object.entries(config.collections).map(async ([name, collection]) => {
          if (typeof collection.data !== 'string') {
            return [
              name,
              resolved.collections[name] ?? {
                data: collection.data,
                metadata: collection.metadata ?? {},
                sources: {},
              },
            ] as const
          }

          return [
            name,
            {
              ...(resolved.collections[name] ?? {
                metadata: collection.metadata ?? {},
                sources: {},
              }),
              data: await loadValueFile(resolveFrom(configDir, collection.data)),
            },
          ] as const
        }),
      ),
    ) as Record<string, IResolvedRegistryBuildCollection>

    collections = {
      ...resolved.collections,
      ...materializedCollections,
    }
  }

  let colors = resolved.colors
  if (typeof config.colors?.data === 'string') {
    colors = {
      data: (await loadValueFile(resolveFrom(configDir, config.colors.data))) as Record<string, unknown>,
    }
  }

  let themes = resolved.themes
  if (typeof config.themes?.data === 'string' && themes) {
    themes = {
      ...themes,
      data: themeEntriesSchema.parse(await loadValueFile(resolveFrom(configDir, config.themes.data))),
    }
  }

  let registries = resolved.registries
  if (resolved.registrySource !== 'inline') {
    registries = registryEntriesSchema.parse(await loadValueFile(resolved.registrySource))
  }

  return {
    ...resolved,
    collections,
    colors,
    registries,
    themes: themes
      ? {
          ...themes,
          cssVarKeys: themes.cssVarKeys.length > 0 ? themes.cssVarKeys : deriveThemeCssVarKeys(themes.data ?? {}),
          names: themes.names.length > 0 ? themes.names : Object.keys(themes.data ?? {}),
        }
      : undefined,
  }
}
