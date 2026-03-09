import { Command } from 'commander'
import { require_config_value } from '~/utils/require-config-value'
import { list_command_config } from './list.constants'
import { list_command_action } from './list.libs'

const { name, description, options } = list_command_config
const option_1 = require_config_value(options.option_1, 'missing list command option_1 config')
const option_2 = require_config_value(options.option_2, 'missing list command option_2 config')

export function list_command(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .action(list_command_action)

  return cmd
}
