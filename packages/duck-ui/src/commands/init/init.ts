import { Command } from 'commander'
import { init_command_config } from './init.constants'
import { init_command_action } from './init.libs'

const { name, description, options, argumentss } = init_command_config
const { option_1, option_2 } = options
const { arg_1 } = argumentss

export function init_command(): Command {
  const init_command = new Command(name)

  init_command
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .action(init_command_action)

  return init_command
}
