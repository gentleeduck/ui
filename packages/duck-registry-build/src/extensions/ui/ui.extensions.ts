import { runComponentsPhase, runIndexBuildPhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'

/**
 * Resolves source files and emits the `index.json` artifact that downstream
 * extensions (components, componentIndex) consume.
 */
export function indexBuildExtension(): IRegistryBuildExtension {
  return {
    name: 'indexBuild',
    run: (api) => runIndexBuildPhase(api.context),
    stage: 'afterBuild',
  }
}

/**
 * Reads source files for each indexed entry, applies variable stripping and
 * import rewriting, and emits JSON component payloads. Depends on `indexBuild`.
 */
export function componentsExtension(): IRegistryBuildExtension {
  return {
    name: 'components',
    run: (api) => runComponentsPhase(api.context),
    stage: 'afterBuild',
  }
}
