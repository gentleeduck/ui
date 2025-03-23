import { Command } from 'commander'
import { init_command_config } from './init.constants'
import { init_command_action } from './init.lib'

const { name, description, options } = init_command_config
const { option_1, option_2, option_3, option_4, option_5, option_6 } = options

export function init_command(): Command {
  const init_command = new Command(name)

  init_command
    .description(description)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .option(option_3.flags, option_3.description, option_3.defaultValue)
    .option(option_4.flags, option_4.description, option_4.defaultValue)
    .option(option_5.flags, option_5.description, option_5.defaultValue)
    .option(option_6.flags, option_6.description, option_6.defaultValue)
    .action(init_command_action)

  return init_command
}
