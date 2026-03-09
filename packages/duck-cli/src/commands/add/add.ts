import { Command } from 'commander'
import { require_config_value } from '~/utils/require-config-value'
import { add_command_config } from './add.constants'
import { add_command_action } from './add.libs'

const { name, description, options, arguments_ } = add_command_config
const option_1 = require_config_value(options.option_1, 'missing add command option_1 config')
const option_2 = require_config_value(options.option_2, 'missing add command option_2 config')
const option_3 = require_config_value(options.option_3, 'missing add command option_3 config')
const arg_1 = require_config_value(arguments_.arg_1, 'missing add command arg_1 config')

export function add_command(): Command {
  const add_command = new Command(name)

  add_command
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .option(option_3.flags, option_3.description, option_3.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .option('-a, --all', 'add all available components', false)
    .action(add_command_action)

  return add_command
}
