import { Command } from 'commander'
import { build } from '../../pipeline'
import { applyBuildOptions, toBuildOptions } from './build.options'
import { formatError, formatPhaseSummary, toSerializableResult } from './build.output'
import type { IRegistryBuildCommandOptions } from './build.types'

export async function runBuildCommand(options: IRegistryBuildCommandOptions) {
  try {
    const result = await build(toBuildOptions(options))

    if (options.json) {
      console.log(JSON.stringify(toSerializableResult(result), null, 2))
      return result
    }

    if (!options.silent) {
      console.log(formatPhaseSummary(result))
    }

    return result
  } catch (error) {
    console.error(formatError(error, options.verbose))
    process.exitCode = 1
    return null
  }
}

export function buildCommand() {
  return applyBuildOptions(new Command('build').description('Build the configured registry output')).action(
    async (options: IRegistryBuildCommandOptions) => {
      await runBuildCommand(options)
    },
  )
}

/**
 * Apply build flags to a parent command when `registry-build` is invoked
 * without a subcommand.
 */
export function withBuildOptions(command: Command) {
  return applyBuildOptions(command)
}
