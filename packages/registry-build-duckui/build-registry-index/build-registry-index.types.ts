import { Registry, RegistryEntry } from '@gentleduck/registers'
import { Ora } from 'ora'

// Define the function arguments as a TypeScript type
export type GetComponentFilesArgs = {
  item: RegistryEntry
  type: RegistryEntry['type']
  spinner: Ora
  idx: number
  registry_count: number
}

// Define the function arguments as a TypeScript type
export type BuildRegistryIndexParams = {
  registry: Registry
  spinner: Ora
}
