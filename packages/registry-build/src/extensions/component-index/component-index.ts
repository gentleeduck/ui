import type { IRegistryBuildComponentIndexPhaseOptions } from '../../pipeline/phases'
import { runComponentIndexPhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'
import type { RegistryItemType } from '../ui/ui.registry.types'
import type { RegistryBuildComponentIndexExtensionOptions } from './component-index.types'

export function componentIndexExtension<TType extends RegistryItemType = RegistryItemType>(
  options: RegistryBuildComponentIndexExtensionOptions<TType> = {},
): IRegistryBuildExtension {
  return {
    name: 'componentIndex',
    run: (api) => runComponentIndexPhase(api.context, options as IRegistryBuildComponentIndexPhaseOptions),
    stage: 'afterBuild',
  }
}
