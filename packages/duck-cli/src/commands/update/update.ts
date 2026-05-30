import { Command } from 'commander'
import { updateCommandConfig } from './update.constants'
import { updateCommandAction } from './update.libs'

export function updateCommand(): Command {
  const { name, description, options, arguments_ } = updateCommandConfig
  const { allOption, yesOption, cwdOption } = options
  const { componentsArg } = arguments_

  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(componentsArg.name, componentsArg.description, componentsArg.defaultValue)
    .option(allOption.flags, allOption.description, allOption.defaultValue)
    .option(yesOption.flags, yesOption.description, yesOption.defaultValue)
    .option(cwdOption.flags, cwdOption.description, cwdOption.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .action(updateCommandAction)

  return cmd
}
