import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createJiti } from 'jiti'
import { ZodError } from 'zod'
import {
  DEFAULT_COMPONENT_INDEX,
  DEFAULT_CONFIG_FILENAMES,
  DEFAULT_CSS_TEMPLATES,
  DEFAULT_OUTPUT,
  DEFAULT_PIPELINE,
  DEFAULT_SOURCE_GLOB,
  DEFAULT_SOURCE_IGNORE,
  DEFAULT_SOURCE_INDEX_STRATEGY,
  DEFAULT_THEME_RADIUS,
  withRegistryBuildDefaults,
} from './defaults'
import { mergeRegistryBuildConfigs } from './merge'
import { registryBuildConfigSchema, registryEntriesSchema, themeEntriesSchema } from './schema'
import type {
  LoadedRegistryBuildConfig,
  LoadRegistryBuildConfigOptions,
  RegistryBuildConfig,
  RegistryBuildSource,
  RegistryBuildThemeEntry,
  RegistryItemType,
  RegistryItemTypeMap,
  ResolvedRegistryBuildConfig,
  ResolvedRegistryBuildSource,
} from '../types'

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function resolveFrom(baseDir: string, targetPath: string) {
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(baseDir, targetPath)
}

function deriveDeclaredItemTypes(config: RegistryBuildConfig): RegistryItemType[] {
  return [...new Set<RegistryItemType>([
    ...((config.schema?.itemTypes ?? []) as RegistryItemType[]),
    ...(Object.keys(config.sources ?? {}) as RegistryItemType[]),
    ...(Object.keys(config.targetPaths ?? {}) as RegistryItemType[]),
    ...(Object.keys(config.importMappings?.packageMappings ?? {}) as RegistryItemType[]),
    ...((config.componentIndex?.excludeTypes ?? []) as RegistryItemType[]),
  ])].sort()
}

function deriveThemeCssVarKeys(themes: Record<string, RegistryBuildThemeEntry>) {
  return [...new Set(
    Object.values(themes).flatMap((entry) => [
      ...Object.keys(entry.light ?? {}),
      ...Object.keys(entry.dark ?? {}),
    ]),
  )].sort()
}

async function loadValueFile(filePath: string): Promise<unknown> {
  const extension = path.extname(filePath).toLowerCase()
  const canUseJiti = ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'].includes(extension)

  if (extension === '.json') {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  }

  try {
    const moduleUrl = `${pathToFileURL(filePath).href}?t=${Date.now()}`
    const module = (await import(moduleUrl)) as Record<string, unknown>

    return module.default ?? module
  } catch (nativeError) {
    if (canUseJiti) {
      try {
        const jiti = createJiti(import.meta.url, {
          fsCache: false,
          interopDefault: true,
          moduleCache: false,
        })

        return await jiti.import(filePath, { default: true })
      } catch (jitiError) {
        throw new Error(
          `Unable to load "${filePath}". Native import failed: ${
            nativeError instanceof Error ? nativeError.message : String(nativeError)
          }. Jiti fallback failed: ${jitiError instanceof Error ? jitiError.message : String(jitiError)}`,
        )
      }
    }

    throw new Error(
      `Unable to load "${filePath}". JSON config works everywhere; TS/JS config requires a runtime that can import the file directly. ${
        nativeError instanceof Error ? nativeError.message : String(nativeError)
      }`,
    )
  }
}

async function materializeConfigReferences(config: RegistryBuildConfig): Promise<RegistryBuildConfig> {
  let materializedConfig = { ...config }

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

function normalizeConfigFileInput(config: RegistryBuildConfig, configPath: string): RegistryBuildConfig {
  const configDir = path.dirname(configPath)
  const extendEntries = config.extends ? (Array.isArray(config.extends) ? config.extends : [config.extends]) : undefined
  const sourceEntries = Object.entries(config.sources ?? {}) as Array<[RegistryItemType, RegistryBuildSource]>

  return {
    ...config,
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
    ) as RegistryItemTypeMap<RegistryBuildSource>,
    themes:
      typeof config.themes?.data === 'string'
        ? {
            ...config.themes,
            data: resolveFrom(configDir, config.themes.data),
          }
        : config.themes,
  }
}

async function loadRegistryBuildConfigInput(
  configPath: string,
  options: {
    visitedPaths?: Set<string>
  } = {},
): Promise<RegistryBuildConfig> {
  const visitedPaths = options.visitedPaths ?? new Set<string>()
  const normalizedConfigPath = path.resolve(configPath)

  if (visitedPaths.has(normalizedConfigPath)) {
    throw new Error(`Circular registry build config extends detected at "${normalizedConfigPath}".`)
  }

  visitedPaths.add(normalizedConfigPath)

  try {
    const rawConfig = registryBuildConfigSchema.parse((await loadValueFile(normalizedConfigPath)) as RegistryBuildConfig)
    const normalizedConfig = await materializeConfigReferences(normalizeConfigFileInput(rawConfig, normalizedConfigPath))
    const extendPaths = normalizedConfig.extends
      ? Array.isArray(normalizedConfig.extends)
        ? normalizedConfig.extends
        : [normalizedConfig.extends]
      : []

    let mergedConfig: RegistryBuildConfig = {}

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

function toResolvedConfig(config: RegistryBuildConfig, configPath: string): ResolvedRegistryBuildConfig {
  const withDefaults = withRegistryBuildDefaults(registryBuildConfigSchema.parse(config))
  if (!withDefaults.output?.dir) {
    throw new Error(`Registry build config at "${configPath}" must define "output.dir" after resolving extends.`)
  }

  const configDir = path.dirname(configPath)
  const registrySource = withDefaults.registrySource ?? 'inline'
  const sourceEntries = Object.entries(withDefaults.sources ?? {}) as Array<[RegistryItemType, RegistryBuildSource]>

  return {
    ...withDefaults,
    colors: withDefaults.colors?.data
      ? {
          data: typeof withDefaults.colors.data === 'string' ? undefined : withDefaults.colors.data,
        }
      : undefined,
    componentIndex: {
      ...DEFAULT_COMPONENT_INDEX,
      ...withDefaults.componentIndex,
      excludeTypes: withDefaults.componentIndex?.excludeTypes ?? [...DEFAULT_COMPONENT_INDEX.excludeTypes],
      header: withDefaults.componentIndex?.header ?? DEFAULT_COMPONENT_INDEX.header,
    },
    cssTemplates: {
      ...DEFAULT_CSS_TEMPLATES,
      ...withDefaults.cssTemplates,
    },
    extensions: withDefaults.extensions ?? [],
    importMappings: {
      contentRewrites: withDefaults.importMappings?.contentRewrites ?? [],
      packageMappings: withDefaults.importMappings?.packageMappings ?? {},
    },
    output: {
      ...DEFAULT_OUTPUT,
      ...withDefaults.output,
      dir: resolveFrom(configDir, withDefaults.output.dir),
    },
    pipeline: {
      ...DEFAULT_PIPELINE,
      ...withDefaults.pipeline,
    },
    registries: withDefaults.registries ?? {},
    registrySource: registrySource === 'inline' ? 'inline' : resolveFrom(configDir, registrySource),
    schema: {
      itemTypes: deriveDeclaredItemTypes(withDefaults),
    },
    sources: Object.fromEntries(
      sourceEntries.map(([type, source]) => [
        type,
        {
          ...source,
          glob: source.glob ?? DEFAULT_SOURCE_GLOB,
          ignore: source.ignore ?? [...DEFAULT_SOURCE_IGNORE],
          indexStrategy: source.indexStrategy ?? DEFAULT_SOURCE_INDEX_STRATEGY,
          path: resolveFrom(configDir, source.path),
        },
      ]),
    ) as RegistryItemTypeMap<ResolvedRegistryBuildSource>,
    stripVariables: withDefaults.stripVariables ?? [],
    targetPaths: withDefaults.targetPaths ?? {},
    themes: withDefaults.themes
      ? {
          ...withDefaults.themes,
          cssVarKeys: withDefaults.themes.cssVarKeys ?? [],
          data: typeof withDefaults.themes.data === 'string' ? undefined : withDefaults.themes.data,
          defaultRadius: withDefaults.themes.defaultRadius ?? DEFAULT_THEME_RADIUS,
          names: withDefaults.themes.names ?? [],
        }
      : undefined,
  }
}

export async function resolveRegistryBuildConfig(
  config: RegistryBuildConfig,
  options: {
    configPath: string
  },
): Promise<ResolvedRegistryBuildConfig> {
  const resolved = toResolvedConfig(config, options.configPath)
  const configDir = path.dirname(options.configPath)

  let colors = resolved.colors
  if (typeof config.colors?.data === 'string') {
    colors = {
      data: (await loadValueFile(resolveFrom(configDir, config.colors.data))) as Record<string, unknown>,
    }
  }

  let themes = resolved.themes
  if (typeof config.themes?.data === 'string' && themes) {
    const rawThemes = await loadValueFile(resolveFrom(configDir, config.themes.data))
    themes = {
      ...themes,
      data: themeEntriesSchema.parse(rawThemes),
    }
  }

  let registries = resolved.registries
  if (resolved.registrySource !== 'inline') {
    const rawRegistries = await loadValueFile(resolved.registrySource)
    registries = registryEntriesSchema.parse(rawRegistries)
  }

  return {
    ...resolved,
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

export async function findRegistryBuildConfig(cwd = process.cwd()) {
  let currentDir = path.resolve(cwd)

  while (true) {
    for (const filename of DEFAULT_CONFIG_FILENAMES) {
      const candidate = path.join(currentDir, filename)

      if (await pathExists(candidate)) {
        return candidate
      }
    }

    const parentDir = path.dirname(currentDir)

    if (parentDir === currentDir) {
      return null
    }

    currentDir = parentDir
  }
}

export async function loadRegistryBuildConfig(
  options: LoadRegistryBuildConfigOptions = {},
): Promise<LoadedRegistryBuildConfig> {
  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd()
  const configPath = options.configFile
    ? resolveFrom(cwd, options.configFile)
    : await findRegistryBuildConfig(cwd)

  if (!configPath) {
    throw new Error(
      `No registry build config file found from "${cwd}". Checked: ${DEFAULT_CONFIG_FILENAMES.join(', ')}`,
    )
  }

  try {
    const rawConfig = await loadRegistryBuildConfigInput(configPath)
    const config = await resolveRegistryBuildConfig(rawConfig, { configPath })

    return {
      config,
      configDir: path.dirname(configPath),
      configPath,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid registry build config at "${configPath}": ${error.message}`)
    }

    throw error
  }
}
