import type { DiffCommandConfig } from './diff.types'

export const diffCommandConfig: DiffCommandConfig = {
  arguments_: {
    componentsArg: {
      defaultValue: [],
      description: 'component name(s) to diff against the registry. If omitted, shows a picker.',
      name: '[components...]',
    },
  },
  description: 'show differences between local and registry versions of components',
  name: 'diff',
  options: {
    cwdOption: {
      defaultValue: process.cwd(),
      description: 'the working directory. defaults to the current directory.',
      flags: '-c, --cwd <cwd>',
    },
    guiOption: {
      defaultValue: false,
      description: 'open in interactive GUI mode.',
      flags: '-g, --gui',
    },
  },
}
