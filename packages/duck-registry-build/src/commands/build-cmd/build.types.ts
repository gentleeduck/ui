export interface IRegistryBuildCommandOptions {
  changed?: string[]
  changedOnly: boolean
  config?: string
  cwd?: string
  json: boolean
  silent: boolean
  verbose: boolean
}
