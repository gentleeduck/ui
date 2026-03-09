import { Command } from 'commander'
import { require_config_value } from '~/utils/require-config-value'
import { update_command_config } from './update.constants'
import { update_command_action } from './update.libs'

const { name, description, options, arguments_ } = update_command_config
const option_1 = require_config_value(options.option_1, 'missing update command option_1 config')
const option_2 = require_config_value(options.option_2, 'missing update command option_2 config')
const option_3 = require_config_value(options.option_3, 'missing update command option_3 config')
const arg_1 = require_config_value(arguments_.arg_1, 'missing update command arg_1 config')

export function update_command(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .option(option_3.flags, option_3.description, option_3.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .action(update_command_action)

  return cmd
}
