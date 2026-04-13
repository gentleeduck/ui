export type DependenciesType = {
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
}

export type InstallOptions = {
  cwd: string
  workspace?: string
  yes: boolean
  force: boolean
}
