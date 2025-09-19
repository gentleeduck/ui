import { InitCommandConfig } from './init.types'

export const init_command_config: InitCommandConfig = {
  description: 'init the project',
  name: 'init',
  options: {
    option_1: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    option_2: {
      defaultValue: false,
      description: 'use default configuration.',
      flags: '-d, --defaults,',
    },
    option_3: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
    option_4: {
      defaultValue: false,
      description: 'silent mode',
      flags: '-s, --silent',
    },
    option_5: {
      defaultValue: false,
      description: 'will force and overwrite old configurations.',
      flags: '-f, --force',
    },
    option_6: {
      defaultValue: process.cwd(),
      description: 'the source directory. defaults to the current directory.',
      flags: '-sd, --src-dir <src-dir>',
    },
  },
}
