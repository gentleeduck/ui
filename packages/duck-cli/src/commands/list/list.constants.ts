import type { ListCommandConfig } from './list.types'

export const listCommandConfig: ListCommandConfig = {
  arguments_: {
    unusedArg: {
      defaultValue: [],
      description: 'unused',
      name: '',
    },
  },
  description: 'list available components from the registry',
  name: 'list',
  options: {
    typeOption: {
      defaultValue: '',
      description: 'filter by component type (e.g. ui, hook, lib, block)',
      flags: '-t, --type <type>',
    },
    jsonOption: {
      defaultValue: false,
      description: 'output as JSON',
      flags: '-j, --json',
    },
  },
}
