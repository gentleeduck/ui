import { Command } from 'commander'
import { init_command_config } from './init.constants'

const { name, description, option_1, option_2, option_3 } = init_command_config

export function init_command(): Command {
  const init_command = new Command(name)

  init_command
    .description(description)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .option(option_3.flags, option_3.description, option_3.defaultValue)
    .action((opt) => {
      console.log('init', opt)
    })

  return init_command
}
