import type { RegistryBuildBranding } from '../types'
import { runBannerPhase } from '../pipeline/phases'
import type { RegistryBuildExtension } from './types'

export function bannerExtension(options: RegistryBuildBranding = {}): RegistryBuildExtension {
  return {
    name: 'banner',
    run: (api) => runBannerPhase(api.context, options),
    stage: 'beforeBuild',
  }
}
