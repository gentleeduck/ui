import type { AddCommandConfig } from './add.types'

export const addCommandConfig: AddCommandConfig = {
  arguments_: {
    arg1: {
      defaultValue: [],
      description:
        'names, url or local path to component to install when you do not provide this you will be directed to a list of the components to select from',
      name: '[components...]',
    },
  },
  description: 'add components to your project',
  name: 'add',
  options: {
    option1: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    option2: {
      defaultValue: false,
      description: 'overwrite existing components',
      flags: '-f, --force',
    },
    option3: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
  },
}
