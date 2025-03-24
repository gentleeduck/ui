import { Ora } from 'ora'
import { highlighter } from '../text-styling'
import { Registry, RegistryEntry } from '../get-registry'
import { DuckUI } from '../preflight-configs/preflight-duckui'

export async function registry_component_install(
  components: Registry,
  duck_config: DuckUI,
  _options: { yes: boolean },
  spinner: Ora,
) {
  try {
    spinner.text = `🦆 Installing ${highlighter.info('components')} ${highlighter.info(components.length)}...`
    console.log(duck_config.aliases.ui)
    components.map((component) => {})
  } catch (error) {
    spinner.fail('🦆 Failed to install components')
    process.exit(0)
  }
}
