import { Ora } from 'ora'
import { Registry } from '../get-registry'
import { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import { get_installation_config, process_components } from './registry-mutation.lib'

export async function registry_component_install(
  components: Registry,
  duck_config: DuckUI,
  options: { yes: boolean },
  spinner: Ora,
) {
  try {
    spinner.text = `🦆 Installing ${highlighter.info('components')} ${highlighter.info(components.length)}...`

    const write_path = await get_installation_config(duck_config, spinner, options.yes)

    await process_components(components, write_path, spinner)
  } catch (error) {
    spinner.fail('🦆 Failed to install components')
    process.exit(1)
  }
}
