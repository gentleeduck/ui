import type { Ora } from 'ora'
import type { Registry } from '../get-registry'
import type { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import { getInstallationConfig, processComponents } from './registry-mutation.lib'
import type { InstallOptions } from './registry-mutation.types'

/**
 * Entry point used by `add` / `init`. Errors propagate up to the command-action wrapper —
 * inner helpers (`getInstallationConfig`, `processComponents`) already render a meaningful
 * `spinner.fail` line, so the caller only needs to decide whether to `process.exit(1)`.
 */
export async function registryComponentInstall(
  components: Registry.Collection,
  duckConfig: DuckUI,
  options: InstallOptions,
  spinner: Ora,
) {
  spinner.text = `Installing ${highlighter.info('components')} ${highlighter.info(components.length)}...`

  const writePath = await getInstallationConfig(duckConfig, spinner, options)

  await processComponents(duckConfig, components, writePath, spinner, options)
}
