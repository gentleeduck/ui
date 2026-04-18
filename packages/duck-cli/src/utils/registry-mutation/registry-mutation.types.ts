export type DependenciesType = {
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
}

export type InstallOptions = {
  cwd: string
  workspace?: string | undefined
  yes: boolean
  force: boolean
}
