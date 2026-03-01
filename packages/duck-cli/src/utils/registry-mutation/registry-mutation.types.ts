export type DependenciesType = {
  dependencies: string[]
  dev_dependencies: string[]
  registry_dependencies: string[]
}

export type InstallOptions = {
  cwd: string
  workspace?: string
  yes: boolean
  force: boolean
}
