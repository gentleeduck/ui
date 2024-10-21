import { Command } from 'commander'
import { getPackageJson } from '../utils/get-package-json'
import { config } from './main.constants'
import { init_command } from '../commands/init'

export function init() {
  const duck_ui = new Command()
  const packageJson = getPackageJson()

  duck_ui.name(packageJson.name || config.name)
  duck_ui.description(packageJson.description || config.description)
  duck_ui.version(packageJson.version || config.version)
  duck_ui.addCommand(init_command())

  duck_ui.parse()
}
