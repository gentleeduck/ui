import { InitCommandConfig } from './init.types'

export const init_command_config: InitCommandConfig = {
  name: 'init',
  description: 'init the project',
  argumentss: {
    arg_1: {
      name: '[components...]',
      description:
        'names, url or local path to component to install when you do not provide this you will be directed to a list of the components to select from',
      defaultValue: [],
    },
  },
  options: {
    option_1: {
      flags: '-y, --yes',
      description: 'skip confirmation prompt.',
      defaultValue: false,
    },
    option_2: {
      flags: '-c, --cwd <cwd>',
      description: 'the working directory. defaults to the current directory.',
      defaultValue: process.cwd(),
    },
    option_3: {
      flags: '-f, --force',
      description: 'overwrite existing components',
      defaultValue: false,
    },
  },
}
