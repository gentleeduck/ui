import type { Ora } from 'ora'
import type { Registry } from '../get-registry'
import type { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import { getInstallationConfig, processComponents } from './registry-mutation.lib'
import type { InstallOptions } from './registry-mutation.types'

export async function registryComponentInstall(
  components: Registry.Collection,
  duckConfig: DuckUI,
  options: InstallOptions,
  spinner: Ora,
) {
  try {
    spinner.text = `Installing ${highlighter.info('components')} ${highlighter.info(components.length)}...`

    const writePath = await getInstallationConfig(duckConfig, spinner, options)

    await processComponents(duckConfig, components, writePath, spinner, options)
  } catch (_error) {
    spinner.fail('Failed to install components')
    process.exit(1)
  }
}
