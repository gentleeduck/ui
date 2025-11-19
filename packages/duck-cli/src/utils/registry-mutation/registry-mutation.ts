import type { Ora } from 'ora'
import type { addOptions } from '~/commands/add'
import type { Registry } from '../get-registry'
import type { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import { get_installation_config, process_components } from './registry-mutation.lib'

export async function registry_component_install(
  components: Registry,
  duck_config: DuckUI,
  options: addOptions,
  spinner: Ora,
) {
  try {
    spinner.text = `🦆 Installing ${highlighter.info('components')} ${highlighter.info(components.length)}...`

    const write_path = await get_installation_config(duck_config, spinner, options)

    await process_components(duck_config, components, write_path, spinner, options)
  } catch (_error) {
    spinner.fail('🦆 Failed to install components')
    process.exit(1)
  }
}
