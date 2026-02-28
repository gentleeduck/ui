import { Command } from 'commander'
import { add_command } from '~/commands/add'
import { init_command } from '~/commands/init'
import { list_command } from '~/commands/list'
import { get_package_json } from '~/utils'
import { set_verbose } from '~/utils/verbose'
import { config } from './main.constants'

export async function init() {
  if (process.argv.includes('--gui')) {
    const { launch_gui } = await import('~/gui')
    launch_gui()
    return
  }

  const duck_ui = new Command()
  const packageJson = get_package_json()

  duck_ui.name(packageJson?.name || config.name)
  duck_ui.description(packageJson?.description || config.description)
  duck_ui.version(packageJson?.version || config.version)
  duck_ui.option('--verbose', 'show detailed error output for debugging', false)
  duck_ui.hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts()
    if (opts.verbose) {
      set_verbose(true)
    }
  })
  duck_ui.addCommand(init_command())
  duck_ui.addCommand(add_command())
  duck_ui.addCommand(list_command())

  duck_ui.parse()
}
