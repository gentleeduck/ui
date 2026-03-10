import type {
  RegistryBuildContext,
  RegistryBuildOutputRecord,
  RegistryBuildPathRegistry,
  RegistryBuildPhaseResult,
} from '../pipeline/types'

export type RegistryBuildExtensionStage = 'beforeBuild' | 'afterBuild'

export interface RegistryBuildExtensionApi {
  artifacts: RegistryBuildContext['artifacts']
  config: RegistryBuildContext['config']
  context: RegistryBuildContext
  getArtifact: RegistryBuildContext['getArtifact']
  getOutput: RegistryBuildContext['getOutput']
  getPath: RegistryBuildContext['getPath']
  listOutputs: () => RegistryBuildOutputRecord[]
  paths: RegistryBuildPathRegistry
  registerOutput: RegistryBuildContext['registerOutput']
  setArtifact: RegistryBuildContext['setArtifact']
}

export type RegistryBuildExtensionRunResult =
  | void
  | RegistryBuildPhaseResult
  | RegistryBuildPhaseResult[]
  | Promise<void | RegistryBuildPhaseResult | RegistryBuildPhaseResult[]>

export interface RegistryBuildExtension {
  name: string
  run: (api: RegistryBuildExtensionApi) => RegistryBuildExtensionRunResult
  stage?: RegistryBuildExtensionStage
}
