import type { Command } from 'commander'
import type { IBuildOptions } from '../../pipeline'
import type { IRegistryBuildCommandOptions } from './build.types'

/**
 * Attach the shared build flags to a Commander command. This stays separate so
 * the root CLI entry point and the `build` subcommand cannot drift.
 */
export function applyBuildOptions(command: Command) {
  return command
    .option('-c, --config <path>', 'path to the registry build config file')
    .option('--cwd <path>', 'working directory used for config discovery')
    .option(
      '--changed-only',
      'reuse cache aggressively and limit work to the supplied changed paths when provided',
      false,
    )
    .option('--changed <paths...>', 'paths considered changed for an incremental rebuild')
    .option('--silent', 'disable banner and summary output', false)
    .option('--json', 'print a machine-readable build summary', false)
    .option('--verbose', 'show the full error stack', false)
}

export function toBuildOptions(options: IRegistryBuildCommandOptions): IBuildOptions {
  return {
    changedOnly: options.changedOnly || (options.changed?.length ?? 0) > 0,
    changedPaths: options.changed ?? [],
    configFile: options.config,
    cwd: options.cwd,
    silent: options.silent,
  }
}
