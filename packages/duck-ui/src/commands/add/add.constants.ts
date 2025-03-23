import { addCommandConfig } from './add.types'

export const add_command_config: addCommandConfig = {
  name: 'add',
  description: 'add the project',
  options: {
    option_1: {
      flags: '-y, --yes',
      description: 'skip confirmation prompt.',
      defaultValue: false,
    },
  },
}
