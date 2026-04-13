import { Command } from 'commander'
import { initCommandConfig } from './init.constants'
import { initCommandAction } from './init.lib'

const { name, description, options } = initCommandConfig
const { option1, option2, option3, option4, option5, option6 } = options

export function initCommand(): Command {
  const initCommand = new Command(name)

  initCommand
    .description(description)
    .option(option1!.flags, option1!.description, option1!.defaultValue)
    .option(option2!.flags, option2!.description, option2!.defaultValue)
    .option(option3!.flags, option3!.description, option3!.defaultValue)
    .option(option4!.flags, option4!.description, option4!.defaultValue)
    .option(option5!.flags, option5!.description, option5!.defaultValue)
    .option(option6!.flags, option6!.description, option6!.defaultValue)
    .action(initCommandAction)

  return initCommand
}
