import { runBannerPhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'
import type { IRegistryBuildBannerExtensionOptions } from './banner.types'

export function bannerExtension(options: IRegistryBuildBannerExtensionOptions = {}): IRegistryBuildExtension {
  return {
    name: 'banner',
    run: (api) => runBannerPhase(api.context, options),
    stage: 'beforeBuild',
  }
}
