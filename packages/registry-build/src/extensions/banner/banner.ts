import { runBannerPhase } from '../../pipeline/phases'
import type { IRegistryBuildExtension } from '../extension'
import type { IRegistryBuildBannerExtensionOptions } from './banner.types'

/** Extension that prints a CLI banner before the build starts. */
export function bannerExtension(options: IRegistryBuildBannerExtensionOptions = {}): IRegistryBuildExtension {
  return {
    name: 'banner',
    run: (api) => runBannerPhase(api.context, options),
    stage: 'beforeBuild',
  }
}
