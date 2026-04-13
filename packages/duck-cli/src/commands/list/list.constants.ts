import type { ListCommandConfig } from './list.types'

export const listCommandConfig: ListCommandConfig = {
  arguments_: {
    arg1: {
      defaultValue: [],
      description: 'unused',
      name: '',
    },
  },
  description: 'list available components from the registry',
  name: 'list',
  options: {
    option1: {
      defaultValue: '',
      description: 'filter by component type (e.g. ui, hook, lib, block)',
      flags: '-t, --type <type>',
    },
    option2: {
      defaultValue: false,
      description: 'output as JSON',
      flags: '-j, --json',
    },
  },
}
