import { Command } from 'commander'
import { requireConfigValue } from '~/utils/require-config-value'
import { addCommandConfig } from './add.constants'
import { addCommandAction } from './add.libs'

const { name, description, options, arguments_ } = addCommandConfig
const option1 = requireConfigValue(options.option1, 'missing add command option1 config')
const option2 = requireConfigValue(options.option2, 'missing add command option2 config')
const option3 = requireConfigValue(options.option3, 'missing add command option3 config')
const arg1 = requireConfigValue(arguments_.arg1, 'missing add command arg1 config')

export function addCommand(): Command {
  const addCommand = new Command(name)

  addCommand
    .description(description)
    .argument(arg1.name, arg1.description, arg1.defaultValue)
    .option(option1.flags, option1.description, option1.defaultValue)
    .option(option2.flags, option2.description, option2.defaultValue)
    .option(option3.flags, option3.description, option3.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .option('-a, --all', 'add all available components', false)
    .action(addCommandAction)

  return addCommand
}
