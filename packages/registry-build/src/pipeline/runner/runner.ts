import { loadRegistryBuildConfig } from '../../config/loader/loader'
import type { IRegistryBuildExtensionApi } from '../../extensions/extension'
import { createRegistryBuildContext } from '../context/context'
import type { IBuildOptions, IBuildResult, IRegistryBuildContext, IRegistryBuildPhaseResult } from '../types'

function createExtensionApi(context: IRegistryBuildContext): IRegistryBuildExtensionApi {
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

async function runExtensionStage(context: IRegistryBuildContext, stage: 'beforeBuild' | 'afterBuild') {
  const phaseResults: IRegistryBuildPhaseResult[] = []
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

/**
 * Runs the build pipeline. The runner itself only orchestrates `beforeBuild`
 * then `afterBuild` extensions — all real work (index-build, components, colors)
 * comes from extensions registered in the config (typically via `uiRegistryPreset()`).
 */
export async function build(options: IBuildOptions = {}): Promise<IBuildResult> {
  const loaded = await loadRegistryBuildConfig({
    configFile: options.configFile,
    cwd: options.cwd,
  })
  const context = await createRegistryBuildContext(loaded, options)
  const phaseResults: IRegistryBuildPhaseResult[] = []

  phaseResults.push(...(await runExtensionStage(context, 'beforeBuild')))
  phaseResults.push(...(await runExtensionStage(context, 'afterBuild')))
  await context.cache.save()

  return {
    artifacts: context.artifacts,
    configPath: context.configPath,
    outputPaths: context.outputPaths,
    outputs: context.listOutputs(),
    paths: context.paths,
    phaseResults,
  }
}
