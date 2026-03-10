import type { RegistryEntry } from '../../extensions/ui/ui.registry.types'

/**
 * Shared type contract for framework-specific component-index adapters.
 */
export interface RegistryBuildComponentIndexImportOptions {
  componentPath: string
  id: string
  ssr: boolean
}

export interface RegistryBuildComponentIndexEntryOptions {
  id: string
  item: RegistryEntry
}

export interface RegistryBuildComponentIndexAdapter {
  defaultHeader: string
  renderEntry: (options: RegistryBuildComponentIndexEntryOptions) => string
  renderImport: (options: RegistryBuildComponentIndexImportOptions) => string
}
