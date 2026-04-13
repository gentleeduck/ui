import { Command } from 'commander'
import { initCommand } from '../commands/init'
import { getPackageJson } from '../utils'
import { config } from './main.constants'

export function init() {
  const duck_ui = new Command()
  const packageJson = getPackageJson()

  duck_ui.name(packageJson?.name || config.name)
  duck_ui.description(packageJson?.description || config.description)
  duck_ui.version(packageJson?.version || config.version)
  duck_ui.addCommand(initCommand())

  duck_ui.parse()
}
