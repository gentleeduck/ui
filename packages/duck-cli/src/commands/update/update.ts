import { Command } from 'commander'
import { requireConfigValue } from '~/utils/require-config-value'
import { updateCommandConfig } from './update.constants'
import { updateCommandAction } from './update.libs'

const { name, description, options, arguments_ } = updateCommandConfig
const option1 = requireConfigValue(options['option1'], 'missing update command option1 config')
const option2 = requireConfigValue(options['option2'], 'missing update command option2 config')
const option3 = requireConfigValue(options['option3'], 'missing update command option3 config')
const arg1 = requireConfigValue(arguments_['arg1'], 'missing update command arg1 config')

export function updateCommand(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(arg1.name, arg1.description, arg1.defaultValue)
    .option(option1.flags, option1.description, option1.defaultValue)
    .option(option2.flags, option2.description, option2.defaultValue)
    .option(option3.flags, option3.description, option3.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .action(updateCommandAction)

  return cmd
}
