import { Command } from 'commander'
import { remove_command_config } from './remove.constants'
import { remove_command_action } from './remove.libs'

const { name, description, options, arguments_ } = remove_command_config
const { option_1, option_2 } = options
const { arg_1 } = arguments_

export function remove_command(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .action(remove_command_action)

  return cmd
}
