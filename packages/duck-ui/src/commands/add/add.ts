import { Command } from 'commander'
import { add_command_config } from './add.constants'
import { add_command_action } from './add.libs'

const { name, description, options } = add_command_config
const { option_1 } = options

export function add_command(): Command {
  const add_command = new Command(name)

  add_command
    .description(description)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .action(add_command_action)

  return add_command
}
