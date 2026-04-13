import { Command } from 'commander'
import { requireConfigValue } from '~/utils/require-config-value'
import { diffCommandConfig } from './diff.constants'
import { diffCommandAction } from './diff.libs'

const { name, description, options, arguments_ } = diffCommandConfig
const option1 = requireConfigValue(options.option1, 'missing diff command option1 config')
const option2 = requireConfigValue(options.option2, 'missing diff command option2 config')
const arg1 = requireConfigValue(arguments_.arg1, 'missing diff command arg1 config')

export function diffCommand(): Command {
  const cmd = new Command(name)

  cmd
    .description(description)
    .argument(arg1.name, arg1.description, arg1.defaultValue)
    .option(option1.flags, option1.description, option1.defaultValue)
    .option(option2.flags, option2.description, option2.defaultValue)
    .option('-w, --workspace <path>', 'workspace path override (relative to monorepo root)')
    .action(diffCommandAction)

  return cmd
}
