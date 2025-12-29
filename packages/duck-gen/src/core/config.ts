import fs from 'node:fs'
import path from 'node:path'
import * as toml from '@iarna/toml'
import type {
  ApiRoutesConfig,
  DuckGenConfig,
  DuckGenExtensionsConfig,
  DuckGenSharedConfig,
  DuckGenTomlConfig,
  MessagesConfig,
} from './types'

const DEFAULT_SOURCE_GLOBS = ['src/**/*.ts', 'src/**/*.tsx']

export function getDefaultSharedConfig(baseDir: string): DuckGenSharedConfig {
  return {
    includeNodeModules: false,
    sourceGlobs: [...DEFAULT_SOURCE_GLOBS],
    tsconfigPath: path.resolve(baseDir, 'tsconfig.json'),
  }
}

export function getDefaultApiRoutesConfig(
  baseDir: string,
  shared: DuckGenSharedConfig = getDefaultSharedConfig(baseDir),
): ApiRoutesConfig {
  return {
    enabled: true,
    globalPrefix: '/api',
    includeNodeModules: shared.includeNodeModules,
    normalizeAnyToUnknown: true,
    sourceGlobs: shared.sourceGlobs,
    tsconfigPath: shared.tsconfigPath,
  }
}

export function getDefaultMessagesConfig(
  baseDir: string,
  shared: DuckGenSharedConfig = getDefaultSharedConfig(baseDir),
): MessagesConfig {
  return {
    enabled: true,
    includeNodeModules: shared.includeNodeModules,
    sourceGlobs: shared.sourceGlobs,
    tsconfigPath: shared.tsconfigPath,
  }
}

export function getDefaultExtensionsConfig(baseDir: string): DuckGenExtensionsConfig {
  const shared = getDefaultSharedConfig(baseDir)
  return {
    shared,
    apiRoutes: getDefaultApiRoutesConfig(baseDir, shared),
    messages: getDefaultMessagesConfig(baseDir, shared),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const out = value.filter((entry) => typeof entry === 'string') as string[]
  return out.length ? out : undefined
}

function resolvePath(baseDir: string, value: string | undefined, fallback: string | undefined): string | undefined {
  if (!value) return fallback
  return path.resolve(baseDir, value)
}

function resolveGlobs(
  baseDir: string,
  value: string[] | undefined,
  fallback: string[] | undefined,
): string[] | undefined {
  const globs = value ?? fallback
  if (!globs) return undefined
  return globs.map((glob) => (path.isAbsolute(glob) ? glob : path.resolve(baseDir, glob)))
}

function parseTomlConfig(filePath: string): {
  found: boolean
  config: DuckGenTomlConfig
  warnings: string[]
} {
  if (!fs.existsSync(filePath)) return { found: false, config: {}, warnings: [] }

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = toml.parse(raw)
    if (!isRecord(parsed)) {
      return { found: true, config: {}, warnings: ['[config] duck-gen.toml must be a TOML table.'] }
    }
    return { found: true, config: parsed as DuckGenTomlConfig, warnings: [] }
  } catch (error) {
    return {
      found: true,
      config: {},
      warnings: [`[config] Failed to parse duck-gen.toml: ${error instanceof Error ? error.message : String(error)}`],
    }
  }
}

export function loadDuckGenConfig(options: { cwd?: string; configPath?: string } = {}): {
  config: DuckGenConfig
  warnings: string[]
  configFileFound: boolean
} {
  const cwd = options.cwd ?? process.cwd()
  const configPath = options.configPath ?? path.resolve(cwd, 'duck-gen.toml')
  const configDir = path.dirname(configPath)
  const defaults = getDefaultExtensionsConfig(configDir)
  const { found, config: tomlConfig, warnings } = parseTomlConfig(configPath)

  const framework = readString(tomlConfig.framework) ?? 'nestjs'
  if (framework !== 'nestjs') {
    warnings.push(`[config] Unsupported framework "${framework}". Only "nestjs" is supported today.`)
  }

  if (found && !isRecord(tomlConfig.extensions)) {
    warnings.push('[config] Missing [extensions] section; using defaults.')
  }
  const ext = isRecord(tomlConfig.extensions) ? tomlConfig.extensions : {}
  const sharedToml = isRecord(ext.shared) ? (ext.shared as Partial<DuckGenSharedConfig>) : {}
  const apiRoutesToml = isRecord(ext.apiRoutes) ? (ext.apiRoutes as Partial<ApiRoutesConfig>) : {}
  const messagesToml = isRecord(ext.messages) ? (ext.messages as Partial<MessagesConfig>) : {}

  const shared: DuckGenSharedConfig = {
    ...defaults.shared,
    includeNodeModules: readBoolean(sharedToml.includeNodeModules) ?? defaults.shared.includeNodeModules,
    sourceGlobs:
      resolveGlobs(configDir, readStringArray(sharedToml.sourceGlobs), defaults.shared.sourceGlobs) ??
      defaults.shared.sourceGlobs,
    tsconfigPath:
      resolvePath(configDir, readString(sharedToml.tsconfigPath), defaults.shared.tsconfigPath) ??
      defaults.shared.tsconfigPath,
  }

  const apiRoutes: ApiRoutesConfig = {
    ...defaults.apiRoutes,
    ...apiRoutesToml,
    enabled: readBoolean(apiRoutesToml.enabled) ?? defaults.apiRoutes.enabled,
    globalPrefix: readString(apiRoutesToml.globalPrefix) ?? defaults.apiRoutes.globalPrefix,
    includeNodeModules: readBoolean(apiRoutesToml.includeNodeModules) ?? shared.includeNodeModules,
    normalizeAnyToUnknown: readBoolean(apiRoutesToml.normalizeAnyToUnknown) ?? defaults.apiRoutes.normalizeAnyToUnknown,
    sourceGlobs:
      resolveGlobs(configDir, readStringArray(apiRoutesToml.sourceGlobs), shared.sourceGlobs) ?? shared.sourceGlobs,
    tsconfigPath: resolvePath(configDir, readString(apiRoutesToml.tsconfigPath), shared.tsconfigPath)!,
  }

  const messages: MessagesConfig = {
    ...defaults.messages,
    ...messagesToml,
    enabled: readBoolean(messagesToml.enabled) ?? defaults.messages.enabled,
    includeNodeModules: readBoolean(messagesToml.includeNodeModules) ?? shared.includeNodeModules,
    sourceGlobs:
      resolveGlobs(configDir, readStringArray(messagesToml.sourceGlobs), shared.sourceGlobs) ?? shared.sourceGlobs,
    tsconfigPath: resolvePath(configDir, readString(messagesToml.tsconfigPath), shared.tsconfigPath)!,
  }

  return {
    config: {
      configPath,
      extensions: {
        shared,
        apiRoutes,
        messages,
      },
      framework,
    },
    configFileFound: found,
    warnings,
  }
}
