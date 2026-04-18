import type { InitCommandConfig } from './init.types'

export const initCommandConfig: InitCommandConfig = {
  description: 'init the project',
  name: 'init',
  options: {
    option1: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    option2: {
      defaultValue: false,
      description: 'use default configuration.',
      flags: '-d, --defaults,',
    },
    option3: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
    option4: {
      defaultValue: false,
      description: 'silent mode',
      flags: '-s, --silent',
    },
    option5: {
      defaultValue: false,
      description: 'will force and overwrite old configurations.',
      flags: '-f, --force',
    },
    option6: {
      defaultValue: process.cwd(),
      description: 'the source directory. defaults to the current directory.',
      flags: '-sd, --src-dir <src-dir>',
    },
  },
}
