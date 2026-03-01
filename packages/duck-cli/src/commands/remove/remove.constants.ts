import type { RemoveCommandConfig } from './remove.types'

export const remove_command_config: RemoveCommandConfig = {
  arguments_: {
    arg_1: {
      defaultValue: [],
      description: 'component name(s) to remove. If omitted, shows an interactive picker.',
      name: '[components...]',
    },
  },
  description: 'remove installed components',
  name: 'remove',
  options: {
    option_1: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    option_2: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
  },
}
