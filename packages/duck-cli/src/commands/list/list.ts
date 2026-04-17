import { Command } from 'commander'
import { requireConfigValue } from '~/utils/require-config-value'
import { listCommandConfig } from './list.constants'
import { listCommandAction } from './list.libs'

const { name, description, options } = listCommandConfig
const option1 = requireConfigValue(options['option1'], 'missing list command option1 config')
const option2 = requireConfigValue(options['option2'], 'missing list command option2 config')

export function listCommand(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .option(option1.flags, option1.description, option1.defaultValue)
    .option(option2.flags, option2.description, option2.defaultValue)
    .action(listCommandAction)

  return cmd
}
