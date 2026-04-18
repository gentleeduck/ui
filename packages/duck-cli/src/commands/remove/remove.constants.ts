import type { RemoveCommandConfig } from './remove.types'

export const removeCommandConfig: RemoveCommandConfig = {
  arguments_: {
    arg1: {
      defaultValue: [],
      description: 'component name(s) to remove. If omitted, shows an interactive picker.',
      name: '[components...]',
    },
  },
  description: 'remove installed components',
  name: 'remove',
  options: {
    option1: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    option2: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
  },
}
