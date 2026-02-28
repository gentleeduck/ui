export type DependenciesType = {
  dependencies: string[]
  dev_dependencies: string[]
  registry_dependencies: string[]
}

export type InstallOptions = {
  yes: boolean
  force: boolean
}
