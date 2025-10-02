import type { InitCommandConfig } from './init.types'

export const init_command_config: InitCommandConfig = {
  argumentss: {
    arg_1: {
      defaultValue: [],
      description:
        'names, url or local path to component to install when you do not provide this you will be directed to a list of the components to select from',
      name: '[components...]',
    },
  },
  description: 'init the project',
  name: 'init',
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
    option_3: {
      defaultValue: false,
      description: 'overwrite existing components',
      flags: '-f, --force',
    },
  },
}
