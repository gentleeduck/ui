import kleur from 'kleur'
import type { IRegistryBuildBranding } from '../../../config/types'
import { config as mainConfig } from '../../../main/main.constants'
import type { IRegistryBuildContext } from '../../types'

export async function runBannerPhase(
  context: IRegistryBuildContext,
  branding: IRegistryBuildBranding = {},
): Promise<void> {
  if (context.silent) {
    return
  }

  const text = branding.name ?? context.config.branding?.name ?? mainConfig.name
  const line = '\u2500'.repeat(` 🦆 ${text} ${mainConfig.version}`.length)

  console.log(kleur.white(`\n 🦆 ${text} ${mainConfig.version}`))
  console.log(kleur.bold().green(line))
}
