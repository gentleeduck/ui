import { runComponentsPhase, runIndexBuildPhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'

// Both extensions are thin wrappers around the phase functions; the wiring
// (afterBuild stage, named identity, dependency on index) is documented on
// `uiRegistryPreset` rather than restated here.
export function indexBuildExtension(): IRegistryBuildExtension {
  return {
    name: 'indexBuild',
    run: (api) => runIndexBuildPhase(api.context),
    stage: 'afterBuild',
  }
}

export function componentsExtension(): IRegistryBuildExtension {
  return {
    name: 'components',
    run: (api) => runComponentsPhase(api.context),
    stage: 'afterBuild',
  }
}
