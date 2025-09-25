import { Command } from 'commander'
import { template_command_config } from './template.constants'

// import { template_command_action } from './template.libs'

const { name, description, options, argumentss } = template_command_config
const { option_1, option_2 } = options
const { arg_1 } = argumentss

export function template_command(): Command {
  const template_command = new Command(name)

  template_command
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
  // .action(template_command_action)

  return template_command
}
