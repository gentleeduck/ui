import { Command } from 'commander'
import { list_command_config } from './list.constants'
import { list_command_action } from './list.libs'

const { name, description, options } = list_command_config
const { option_1, option_2 } = options

export function list_command(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .action(list_command_action)

  return cmd
}
