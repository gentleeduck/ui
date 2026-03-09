import { Command } from 'commander'
import { require_config_value } from '~/utils/require-config-value'
import { diff_command_config } from './diff.constants'
import { diff_command_action } from './diff.libs'

const { name, description, options, arguments_ } = diff_command_config
const option_1 = require_config_value(options.option_1, 'missing diff command option_1 config')
const option_2 = require_config_value(options.option_2, 'missing diff command option_2 config')
const arg_1 = require_config_value(arguments_.arg_1, 'missing diff command arg_1 config')

export function diff_command(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .action(diff_command_action)

  return cmd
}
