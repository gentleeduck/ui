import type { addCommandConfig } from './add.types'

export const add_command_config: addCommandConfig = {
  argumentss: {
    arg_1: {
      defaultValue: [],
      description:
        'names, url or local path to component to install when you do not provide this you will be directed to a list of the components to select from',
      name: '[components...]',
    },
  },
  description: 'add the project',
  name: 'add',
  options: {
    option_1: {
      defaultValue: false,
      description: 'skip confirmation prompt.',
      flags: '-y, --yes',
    },
    option_2: {
      defaultValue: false,
      description: 'overwrite existing components',
      flags: '-f, --force',
    },
    // option_3: {
    //   flags: '-r, --registry',
    //   description: 'install from registry',
    //   defaultValue: false,
    // },
  },
}
