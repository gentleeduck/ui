import { templateCommandConfig } from './template.types'

export const template_command_config: templateCommandConfig = {
  name: 'template',
  description: 'template the project',
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
      flags: '-f, --force',
      description: 'overwrite existing components',
      defaultValue: false,
    },
    // option_3: {
    //   flags: '-r, --registry',
    //   description: 'install from registry',
    //   defaultValue: false,
    // },
  },
}
