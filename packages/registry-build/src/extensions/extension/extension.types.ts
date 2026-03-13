import type {
  RegistryBuildContext,
  RegistryBuildOutputRecord,
  RegistryBuildPathRegistry,
  RegistryBuildPhaseResult,
} from '../../pipeline/types'

/**
 * When the extension should run relative to the core pipeline.
 *
 * - `beforeBuild` — runs before any processing (validation, setup)
 * - `afterBuild` — runs after processing (output generation, cleanup)
 */
export type RegistryBuildExtensionStage = 'beforeBuild' | 'afterBuild'

/**
 * The API surface available to extensions at runtime.
 *
 * Extensions receive this object in their `run()` function. It provides
 * access to the resolved config, shared artifacts, output registration,
 * and path resolution.
 */
export interface RegistryBuildExtensionApi {
  /** Shared key-value store for passing data between extensions. */
  artifacts: RegistryBuildContext['artifacts']
  /** The fully resolved build config. */
  config: RegistryBuildContext['config']
  /** Full runtime context (for advanced use cases). */
  context: RegistryBuildContext
  /** Retrieve a named artifact set by a previous extension. */
  getArtifact: RegistryBuildContext['getArtifact']
  /** Look up a registered output record by name. */
  getOutput: RegistryBuildContext['getOutput']
  /** Resolve a named path from the path registry. */
  getPath: RegistryBuildContext['getPath']
  /** List all output records registered so far. */
  listOutputs: () => RegistryBuildOutputRecord[]
  /** Path registry with `baseDir` and named paths. */
  paths: RegistryBuildPathRegistry
  /** Register output files produced by this extension. */
  registerOutput: RegistryBuildContext['registerOutput']
  /** Store a named artifact for downstream extensions. */
  setArtifact: RegistryBuildContext['setArtifact']
}

export type RegistryBuildExtensionRunResult =
  | void
  | RegistryBuildPhaseResult
  | RegistryBuildPhaseResult[]
  // biome-ignore lint/suspicious/noConfusingVoidType: void is required for async functions returning nothing
  | Promise<void | RegistryBuildPhaseResult | RegistryBuildPhaseResult[]>

/**
 * A build extension that plugs into the registry build pipeline.
 *
 * Extensions are the primary mechanism for adding behavior to the builder.
 * The builder provides built-in extensions via presets, and users can create
 * their own by implementing this interface.
 *
 * @example
 * ```ts
 * import type { RegistryBuildExtension } from '@gentleduck/registry-build'
 *
 * export function myExtension(): RegistryBuildExtension {
 *   return {
 *     name: 'myExtension',
 *     stage: 'afterBuild',
 *     async run(api) {
 *       const data = api.getArtifact('someData')
 *       // ... process and emit files
 *       api.registerOutput('myExtension', outputFiles)
 *       return { name: 'myExtension', itemCount: outputFiles.length }
 *     },
 *   }
 * }
 * ```
 */
export interface RegistryBuildExtension {
  /** Unique name identifying this extension in logs and phase results. */
  name: string
  /** The function that performs the extension's work. */
  run: (api: RegistryBuildExtensionApi) => RegistryBuildExtensionRunResult
  /** When to run: `'beforeBuild'` or `'afterBuild'` (default). */
  stage?: RegistryBuildExtensionStage
}
