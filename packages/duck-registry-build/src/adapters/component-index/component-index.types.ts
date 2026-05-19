import type { IRegistryEntry } from '../../extensions/ui/ui.registry.types'

export interface IRegistryBuildComponentIndexImportOptions {
  componentPath: string
  id: string
  ssr: boolean
}

export interface IRegistryBuildComponentIndexEntryOptions {
  id: string
  item: IRegistryEntry
}

export interface IRegistryBuildComponentIndexAdapter {
  defaultHeader: string
  renderEntry: (options: IRegistryBuildComponentIndexEntryOptions) => string
  renderImport: (options: IRegistryBuildComponentIndexImportOptions) => string
}
