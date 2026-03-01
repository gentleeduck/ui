import type { DiffCommandConfig } from './diff.types'

export const diff_command_config: DiffCommandConfig = {
  arguments_: {
    arg_1: {
      defaultValue: [],
      description: 'component name(s) to diff against the registry. If omitted, shows a picker.',
      name: '[components...]',
    },
  },
  description: 'show differences between local and registry versions of components',
  name: 'diff',
  options: {
    option_1: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
    option_2: {
      defaultValue: false,
      description: 'open in interactive GUI mode.',
      flags: '-g, --gui',
    },
  },
}
