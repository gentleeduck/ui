export type DuckGenFramework = 'nestjs'

export type DuckGenSharedConfig = {
  sourceGlobs: string[]
  tsconfigPath: string
  includeNodeModules: boolean
}

export type ApiRoutesConfig = {
  enabled: boolean
  sourceGlobs: string[]
  tsconfigPath: string
  globalPrefix: string
  includeNodeModules: boolean
  // 🦆 if true: any -> unknown (recommended)
  normalizeAnyToUnknown: boolean
}

export type MessagesConfig = {
  enabled: boolean
  sourceGlobs: string[]
  tsconfigPath: string
  includeNodeModules: boolean
}

export type DuckGenExtensionsConfig = {
  shared: DuckGenSharedConfig
  apiRoutes: ApiRoutesConfig
  messages: MessagesConfig
}

export type DuckGenOutputPaths = {
  apiRoutes: string
  messages: string
  index: string
}

export type DuckGenConfig = {
  configPath: string
  framework: DuckGenFramework | string
  extensions: DuckGenExtensionsConfig
}

export type DuckGenTomlConfig = {
  framework?: string
  extensions?: {
    shared?: Partial<DuckGenSharedConfig>
    apiRoutes?: Partial<ApiRoutesConfig>
    messages?: Partial<MessagesConfig>
  }
}
