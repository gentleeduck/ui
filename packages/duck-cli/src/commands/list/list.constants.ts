import type { ListCommandConfig } from './list.types'

export const list_command_config: ListCommandConfig = {
  arguments_: {
    arg_1: {
      defaultValue: [],
      description: 'unused',
      name: '',
    },
  },
  description: 'list available components from the registry',
  name: 'list',
  options: {
    option_1: {
      defaultValue: '',
      description: 'filter by component type (e.g. ui, hook, lib, block)',
      flags: '-t, --type <type>',
    },
    option_2: {
      defaultValue: false,
      description: 'output as JSON',
      flags: '-j, --json',
    },
  },
}
