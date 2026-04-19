import { Command } from 'commander'
import { addCommand } from '~/commands/add'
import { diffCommand } from '~/commands/diff'
import { initCommand } from '~/commands/init'
import { listCommand } from '~/commands/list'
import { removeCommand } from '~/commands/remove'
import { updateCommand } from '~/commands/update'
import { getPackageJson } from '~/utils'
import { setVerbose } from '~/utils/verbose'
import { config } from './main.constants'

export async function init() {
  const duckUi = new Command()
  const packageJson = getPackageJson()

  duckUi.name(packageJson?.name || config.name)
  duckUi.description(packageJson?.description || config.description)
  duckUi.version(packageJson?.version || config.version)
  duckUi.option('--verbose', 'show detailed error output for debugging', false)
  duckUi.hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts()
    if (opts['verbose']) {
      setVerbose(true)
    }
  })
  duckUi.addCommand(initCommand())
  duckUi.addCommand(addCommand())
  duckUi.addCommand(updateCommand())
  duckUi.addCommand(removeCommand())
  duckUi.addCommand(diffCommand())
  duckUi.addCommand(listCommand())

  duckUi.parse()
}
