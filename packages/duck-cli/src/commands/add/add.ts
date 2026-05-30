import { Command } from 'commander'
import { addCommandConfig } from './add.constants'
import { addCommandAction } from './add.libs'

export function addCommand(): Command {
  const { name, description, options, arguments_ } = addCommandConfig
  const { yesOption, forceOption, cwdOption } = options
  const { componentsArg } = arguments_

  const addCommand = new Command(name)

  addCommand
    .description(description)
    .argument(componentsArg.name, componentsArg.description, componentsArg.defaultValue)
    .option(yesOption.flags, yesOption.description, yesOption.defaultValue)
    .option(forceOption.flags, forceOption.description, forceOption.defaultValue)
    .option(cwdOption.flags, cwdOption.description, cwdOption.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .option('-a, --all', 'add all available components', false)
    .action(addCommandAction)

  return addCommand
}
