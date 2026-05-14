import path from 'node:path'
import type { RegistryItemType, RegistryItemTypeMap } from '../../extensions/ui/ui.registry.types'
import { mergeRegistryBuildConfigs } from '../merge'
import { registryBuildConfigSchema, registryEntriesSchema, themeEntriesSchema } from '../schema'
import type { IRegistryBuildCollection, IRegistryBuildConfig, IRegistryBuildSource } from '../types'
import { resolveFrom } from './loader.path'
import { loadValueFile } from './loader.value'

async function materializeCollectionData(collections: Record<string, IRegistryBuildCollection>) {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(collections).map(async ([name, collection]) => {
        if (typeof collection.data !== 'string') {
          return [name, collection] as const
        }

        return [
          name,
          {
            ...collection,
            data: await loadValueFile(collection.data),
          },
        ] as const
      }),
    ),
  )
}

function normalizeConfigFileInput(config: IRegistryBuildConfig, configPath: string): IRegistryBuildConfig {
  const configDir = path.dirname(configPath)
  const extendEntries = config.extends ? (Array.isArray(config.extends) ? config.extends : [config.extends]) : undefined
  const collectionEntries = Object.entries(config.collections ?? {}) as Array<[string, IRegistryBuildCollection]>
  const sourceEntries = Object.entries(config.sources ?? {}) as Array<[RegistryItemType, IRegistryBuildSource]>

  return {
    ...config,
    collections: Object.fromEntries(
      collectionEntries.map(([name, collection]) => [
        name,
        {
          ...collection,
          data: typeof collection.data === 'string' ? resolveFrom(configDir, collection.data) : collection.data,
          sources: Object.fromEntries(
            Object.entries(collection.sources ?? {}).map(([sourceName, source]) => [
              sourceName,
              {
                ...source,
                path: resolveFrom(configDir, source.path),
              },
            ]),
          ),
        },
      ]),
    ),
    colors:
      typeof config.colors?.data === 'string'
        ? {
            ...config.colors,
            data: resolveFrom(configDir, config.colors.data),
          }
        : config.colors,
    extends: extendEntries?.map((entry) => resolveFrom(configDir, entry)),
    output: config.output
      ? {
          ...config.output,
          dir: config.output.dir ? resolveFrom(configDir, config.output.dir) : undefined,
        }
      : undefined,
    registrySource:
      config.registrySource && config.registrySource !== 'inline'
        ? resolveFrom(configDir, config.registrySource)
        : config.registrySource,
    sources: Object.fromEntries(
      sourceEntries.map(([type, source]) => [
        type,
        {
          ...source,
          path: resolveFrom(configDir, source.path),
        },
      ]),
    ) as RegistryItemTypeMap<IRegistryBuildSource>,
    themes:
      typeof config.themes?.data === 'string'
        ? {
            ...config.themes,
            data: resolveFrom(configDir, config.themes.data),
          }
        : config.themes,
  }
}

// File-backed sections are loaded eagerly so merge semantics stay simple.
async function materializeConfigReferences(config: IRegistryBuildConfig): Promise<IRegistryBuildConfig> {
  let materializedConfig = { ...config }

  if (materializedConfig.collections) {
    materializedConfig = {
      ...materializedConfig,
      collections: await materializeCollectionData(materializedConfig.collections),
    }
  }

  if (typeof materializedConfig.colors?.data === 'string') {
    materializedConfig = {
      ...materializedConfig,
      colors: {
        ...materializedConfig.colors,
        data: (await loadValueFile(materializedConfig.colors.data)) as Record<string, unknown>,
      },
    }
  }

  if (typeof materializedConfig.themes?.data === 'string') {
    materializedConfig = {
      ...materializedConfig,
      themes: {
        ...materializedConfig.themes,
        data: themeEntriesSchema.parse(await loadValueFile(materializedConfig.themes.data)),
      },
    }
  }

  if (materializedConfig.registrySource && materializedConfig.registrySource !== 'inline') {
    const externalRegistries = registryEntriesSchema.parse(await loadValueFile(materializedConfig.registrySource))

    materializedConfig = {
      ...materializedConfig,
      registries: mergeRegistryBuildConfigs(
        {
          registries: externalRegistries,
          registrySource: 'inline',
        },
        {
          registries: materializedConfig.registries ?? {},
          registrySource: 'inline',
        },
      ).registries,
      registrySource: 'inline',
    }
  }

  return materializedConfig
}

export async function loadRegistryBuildConfigInput(
  configPath: string,
  options: {
    visitedPaths?: Set<string>
  } = {},
): Promise<IRegistryBuildConfig> {
  const visitedPaths = options.visitedPaths ?? new Set<string>()
  const normalizedConfigPath = path.resolve(configPath)

  if (visitedPaths.has(normalizedConfigPath)) {
    throw new Error(`Circular registry build config extends detected at "${normalizedConfigPath}".`)
  }

  visitedPaths.add(normalizedConfigPath)

  try {
    const rawConfig = registryBuildConfigSchema.parse(
      (await loadValueFile(normalizedConfigPath)) as IRegistryBuildConfig,
    )
    const normalizedConfig = await materializeConfigReferences(
      normalizeConfigFileInput(rawConfig, normalizedConfigPath),
    )
    const extendPaths = normalizedConfig.extends
      ? Array.isArray(normalizedConfig.extends)
        ? normalizedConfig.extends
        : [normalizedConfig.extends]
      : []

    let mergedConfig: IRegistryBuildConfig = {}

    for (const extendPath of extendPaths) {
      const extendedConfig = await loadRegistryBuildConfigInput(extendPath, { visitedPaths })
      mergedConfig = mergeRegistryBuildConfigs(mergedConfig, extendedConfig)
    }

    return mergeRegistryBuildConfigs(mergedConfig, {
      ...normalizedConfig,
      extends: undefined,
    })
  } finally {
    visitedPaths.delete(normalizedConfigPath)
  }
}
