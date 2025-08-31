import { InitCommandConfig } from './init.types'

export const init_command_config: InitCommandConfig = {
  name: 'init',
  description: 'init the project',
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
  },
}
