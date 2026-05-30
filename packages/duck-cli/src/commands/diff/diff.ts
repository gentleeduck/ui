import { Command } from 'commander'
import { diffCommandConfig } from './diff.constants'
import { diffCommandAction } from './diff.libs'

export function diffCommand(): Command {
  const { name, description, options, arguments_ } = diffCommandConfig
  const { cwdOption, guiOption } = options
  const { componentsArg } = arguments_

  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(componentsArg.name, componentsArg.description, componentsArg.defaultValue)
    .option(cwdOption.flags, cwdOption.description, cwdOption.defaultValue)
    .option(guiOption.flags, guiOption.description, guiOption.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .action(diffCommandAction)

  return cmd
}
