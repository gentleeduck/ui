import type { RegistryBuildComponentIndexPhaseOptions } from '../../pipeline/phases'
import { runComponentIndexPhase } from '../../pipeline/phases'
import type { RegistryBuildExtension } from '../extension'
import type { RegistryItemType } from '../ui/ui.registry.types'
import type { RegistryBuildComponentIndexExtensionOptions } from './component-index.types'

export function componentIndexExtension<TType extends RegistryItemType = RegistryItemType>(
  options: RegistryBuildComponentIndexExtensionOptions<TType> = {},
): RegistryBuildExtension {
  return {
    name: 'componentIndex',
    run: (api) => runComponentIndexPhase(api.context, options as RegistryBuildComponentIndexPhaseOptions),
    stage: 'afterBuild',
  }
}
