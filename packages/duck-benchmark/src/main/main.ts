import { Command } from 'commander'
import { initCommand } from '../commands/init'
import { getPackageJson } from '../utils'
import { config } from './main.constants'

export function init() {
  const duckUi = new Command()
  const packageJson = getPackageJson()

  duckUi.name(packageJson?.name || config.name)
  duckUi.description(packageJson?.description || config.description)
  duckUi.version(packageJson?.version || config.version)
  duckUi.addCommand(initCommand())

  duckUi.parse()
}
