import { loadRegistryBuildConfig } from '../../config/loader/loader'
import type { RegistryBuildExtensionApi } from '../../extensions/extension'
import { createRegistryBuildContext } from '../context/context'
import type { BuildOptions, BuildResult, RegistryBuildContext, RegistryBuildPhaseResult } from '../types'

function createExtensionApi(context: RegistryBuildContext): RegistryBuildExtensionApi {
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

async function runExtensionStage(context: RegistryBuildContext, stage: 'beforeBuild' | 'afterBuild') {
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

/**
 * Execute the full build pipeline.
 *
 * The runner is entirely extension-driven: it loads config, creates a context,
 * runs `beforeBuild` extensions, then `afterBuild` extensions. All processing
 * (index-build, components, colors, etc.) is provided by extensions registered
 * in the config or via a preset like `uiRegistryPreset()`.
 */
export async function build(options: BuildOptions = {}): Promise<BuildResult> {
  const loaded = await loadRegistryBuildConfig({
    configFile: options.configFile,
    cwd: options.cwd,
  })
  const context = await createRegistryBuildContext(loaded, options)
  const phaseResults: RegistryBuildPhaseResult[] = []

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
