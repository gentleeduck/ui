import { Command } from 'commander'
import { config } from './main.constants'
import { init_command } from '../commands/init'
import { get_package_json } from '../utils'
import { add_command } from '~/commands/add'

export function init() {
  const duck_ui = new Command()
  const packageJson = get_package_json()

  duck_ui.name(packageJson?.name || config.name)
  duck_ui.description(packageJson?.description || config.description)
  duck_ui.version(packageJson?.version || config.version)
  duck_ui.addCommand(init_command())
  duck_ui.addCommand(add_command())

  duck_ui.parse()
}
