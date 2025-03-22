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
      flags: '-d, --defaults,',
      description: 'use default configuration.',
      defaultValue: false,
    },
    option_3: {
      flags: '-c, --cwd <cwd>',
      description: 'the working directory. defaults to the current directory.',
      defaultValue: process.cwd(),
    },
    option_4: {
      flags: '-s, --silent',
      description: 'silent mode',
      defaultValue: false,
    },
    option_5: {
      flags: '-f, --force',
      description: 'will force and overwrite old configurations.',
      defaultValue: false,
    },
    option_6: {
      flags: '-sd, --src-dir <src-dir>',
      description: 'the source directory. defaults to the current directory.',
      defaultValue: process.cwd(),
    },
  },
}
