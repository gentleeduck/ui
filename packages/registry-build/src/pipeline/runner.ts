import { loadRegistryBuildConfig } from '../config'
import type { RegistryBuildExtensionApi } from '../extensions'
import { createRegistryBuildContext } from './context'
import { runComponentsPhase, runIndexBuildPhase } from './phases'
import type { BuildOptions, BuildResult, RegistryBuildPhaseResult } from './types'

function createExtensionApi(context: ReturnType<typeof createRegistryBuildContext>): RegistryBuildExtensionApi {
  return {
    artifacts: context.artifacts,
    config: context.config,
    context,
    getArtifact: context.getArtifact,
    getOutput: context.getOutput,
    getPath: context.getPath,
    listOutputs: context.listOutputs,
    paths: context.paths,
    registerOutput: context.registerOutput,
    setArtifact: context.setArtifact,
  }
}

async function runExtensionStage(
  context: ReturnType<typeof createRegistryBuildContext>,
  stage: 'beforeBuild' | 'afterBuild',
) {
  const phaseResults: RegistryBuildPhaseResult[] = []
  const extensionApi = createExtensionApi(context)

  for (const extension of context.config.extensions) {
    if ((extension.stage ?? 'afterBuild') !== stage) {
      continue
    }

    const result = await extension.run(extensionApi)
    if (!result) {
      continue
    }

    if (Array.isArray(result)) {
      phaseResults.push(...result)
      continue
    }

    phaseResults.push(result)
  }

  return phaseResults
}

export async function build(options: BuildOptions = {}): Promise<BuildResult> {
  const loaded = await loadRegistryBuildConfig({
    configFile: options.configFile,
    cwd: options.cwd,
  })
  const context = createRegistryBuildContext(loaded, options)
  const phaseResults: RegistryBuildPhaseResult[] = []

  phaseResults.push(...(await runExtensionStage(context, 'beforeBuild')))

  if (context.config.pipeline.index) {
    phaseResults.push(await runIndexBuildPhase(context))
  }

  if (context.config.pipeline.components) {
    phaseResults.push(await runComponentsPhase(context))
  }

  phaseResults.push(...(await runExtensionStage(context, 'afterBuild')))

  return {
    artifacts: context.artifacts,
    configPath: context.configPath,
    outputPaths: context.outputPaths,
    outputs: context.listOutputs(),
    paths: context.paths,
    phaseResults,
  }
}
