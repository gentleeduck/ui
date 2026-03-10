import { runBannerPhase } from '../../pipeline/phases'
import type { RegistryBuildExtension } from '../extension'
import type { RegistryBuildBannerExtensionOptions } from './banner.types'

/** Extension that prints a CLI banner before the build starts. */
export function bannerExtension(options: RegistryBuildBannerExtensionOptions = {}): RegistryBuildExtension {
  return {
    name: 'banner',
    run: (api) => runBannerPhase(api.context, options),
    stage: 'beforeBuild',
  }
}
