import { Command } from 'commander'
import { update_command_config } from './update.constants'
import { update_command_action } from './update.libs'

const { name, description, options, arguments_ } = update_command_config
const { option_1, option_2, option_3 } = options
const { arg_1 } = arguments_

export function update_command(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .option(option_3.flags, option_3.description, option_3.defaultValue)
    .action(update_command_action)

  return cmd
}
