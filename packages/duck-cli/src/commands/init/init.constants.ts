import type { InitCommandConfig } from './init.types'

export const initCommandConfig: InitCommandConfig = {
  arguments_: {
    componentsArg: {
      defaultValue: [],
      description:
        'names, url or local path to component to install when you do not provide this you will be directed to a list of the components to select from',
      name: '[components...]',
    },
  },
  description: 'init the project',
  name: 'init',
  options: {
    yesOption: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    cwdOption: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
  },
}
