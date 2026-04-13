import { Command } from 'commander'
import type { IRegistryBuildCommandOptions } from '../commands'
import { buildCommand, runBuildCommand, withBuildOptions } from '../commands'
import { config } from './main.constants'

export function createProgram() {
  const program = withBuildOptions(new Command())

  program.name(config.name)
  program.description(config.description)
  program.version(config.version)
  program.showHelpAfterError()
  program.addCommand(buildCommand())
  program.action(async (options: IRegistryBuildCommandOptions) => {
    await runBuildCommand(options)
  })

  return program
}

export async function init(argv = process.argv) {
  const program = createProgram()
  await program.parseAsync(argv)
  return program
}
