import { Command } from 'commander'
import { require_config_value } from '~/utils/require-config-value'
import { init_command_config } from './init.constants'
import { init_command_action } from './init.libs'

const { name, description, options, arguments_ } = init_command_config
const option_1 = require_config_value(options.option_1, 'missing init command option_1 config')
const option_2 = require_config_value(options.option_2, 'missing init command option_2 config')
const arg_1 = require_config_value(arguments_.arg_1, 'missing init command arg_1 config')

export function init_command(): Command {
  const init_command = new Command(name)

  init_command
    .description(description)
    .argument(arg_1.name, arg_1.description, arg_1.defaultValue)
    .option(option_1.flags, option_1.description, option_1.defaultValue)
    .option(option_2.flags, option_2.description, option_2.defaultValue)
    .option('-p, --project-type <type>', 'project type (NEXT_JS, VITE, TANSTACK_START, UNKNOWN)')
    .option(
      '-b, --base-color <color>',
      'base color theme (zinc, slate, stone, gray, neutral, red, rose, orange, green, blue, yellow, violet)',
    )
    .option('--alias <alias>', 'import alias (default: ~)')
    .option('--css <path>', 'CSS file path (default: ./src/styles.css)')
    .option('--css-variables', 'use CSS variables (default: true)')
    .option('--no-css-variables', 'do not use CSS variables')
    .option('--monorepo', 'project is a monorepo')
    .option('--no-monorepo', 'project is not a monorepo')
    .option('-w, --workspace <path>', 'workspace path (relative to monorepo root)')
    .option('--prefix <prefix>', 'Tailwind prefix')
    .option('-a, --all', 'install all available components', false)
    .action(init_command_action)

  return init_command
}
