import { Command } from 'commander'
import { requireConfigValue } from '~/utils/require-config-value'
import { removeCommandConfig } from './remove.constants'
import { removeCommandAction } from './remove.libs'

const { name, description, options, arguments_ } = removeCommandConfig
const option1 = requireConfigValue(options['option1'], 'missing remove command option1 config')
const option2 = requireConfigValue(options['option2'], 'missing remove command option2 config')
const arg1 = requireConfigValue(arguments_['arg1'], 'missing remove command arg1 config')

export function removeCommand(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(arg1.name, arg1.description, arg1.defaultValue)
    .option(option1.flags, option1.description, option1.defaultValue)
    .option(option2.flags, option2.description, option2.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .action(removeCommandAction)

  return cmd
}
