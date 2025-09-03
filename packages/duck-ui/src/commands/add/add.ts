import { Command } from 'commander'
import { add_command_config } from './add.constants'
import { add_command_action } from './add.libs'

const { name, description, options, argumentss } = add_command_config
const { option_1, option_2 } = options
const { arg_1 } = argumentss

export function add_command(): Command {
  const add_command = new Command(name)

  add_command
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .action(add_command_action)

  return add_command
}
