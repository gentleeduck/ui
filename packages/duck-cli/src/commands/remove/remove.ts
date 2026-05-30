import { Command } from 'commander'
import { removeCommandConfig } from './remove.constants'
import { removeCommandAction } from './remove.libs'

export function removeCommand(): Command {
  const { name, description, options, arguments_ } = removeCommandConfig
  const { yesOption, cwdOption } = options
  const { componentsArg } = arguments_

  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(componentsArg.name, componentsArg.description, componentsArg.defaultValue)
    .option(yesOption.flags, yesOption.description, yesOption.defaultValue)
    .option(cwdOption.flags, cwdOption.description, cwdOption.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .action(removeCommandAction)

  return cmd
}
