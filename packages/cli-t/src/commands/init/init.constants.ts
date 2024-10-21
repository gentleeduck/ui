export const init_command_config = {
  name: 'init',
  description: 'init the project',
  option_1: {
    flags: '-y, --yes',
    description: 'skip confirmation prompt.',
    defaultValue: false
  },
  option_2: {
    flags: '-d, --defaults,',
    description: 'use default configuration.',
    defaultValue: false
  },
  option_3: {
    flags: '-c, --cwd <cwd>',
    description: 'the working directory. defaults to the current directory.',
    defaultValue: process.cwd()
  }
}
