import { Command } from 'commander'
import { listCommandConfig } from './list.constants'
import { listCommandAction } from './list.libs'

export function listCommand(): Command {
  const { name, description, options } = listCommandConfig
  const { typeOption, jsonOption } = options

  const cmd = new Command(name)

  cmd
    .description(description)
    .option(typeOption.flags, typeOption.description, typeOption.defaultValue)
    .option(jsonOption.flags, jsonOption.description, jsonOption.defaultValue)
    .action(listCommandAction)

  return cmd
}
