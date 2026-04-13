import type { UpdateCommandConfig } from './update.types'

export const updateCommandConfig: UpdateCommandConfig = {
  arguments_: {
    arg1: {
      defaultValue: [],
      description: 'component name(s) to update. If omitted, shows an interactive picker.',
      name: '[components...]',
    },
  },
  description: 'update installed components to the latest registry version',
  name: 'update',
  options: {
    option1: {
      defaultValue: false,
      description: 'update all installed components.',
      flags: '-a, --all',
    },
    option2: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    option3: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
  },
}
