/**
 * Commander-facing CLI options for the `registry-build build` command.
 */
export interface IRegistryBuildCommandOptions {
  changed?: string[]
  changedOnly: boolean
  config?: string
  cwd?: string
  json: boolean
  silent: boolean
  verbose: boolean
}
