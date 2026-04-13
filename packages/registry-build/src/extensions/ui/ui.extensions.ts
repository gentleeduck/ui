import { runComponentsPhase, runIndexBuildPhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'

/**
 * Extension wrapper for the index-build pipeline phase.
 *
 * Materializes registry entries by resolving source files and producing the
 * `index.json` artifact consumed by downstream extensions.
 */
export function indexBuildExtension(): IRegistryBuildExtension {
  return {
    name: 'indexBuild',
    run: (api) => runIndexBuildPhase(api.context),
    stage: 'afterBuild',
  }
}

/**
 * Extension wrapper for the components pipeline phase.
 *
 * Processes each indexed registry entry: reads source files, applies variable
 * stripping and import rewriting, and produces JSON component payloads.
 */
export function componentsExtension(): IRegistryBuildExtension {
  return {
    name: 'components',
    run: (api) => runComponentsPhase(api.context),
    stage: 'afterBuild',
  }
}
