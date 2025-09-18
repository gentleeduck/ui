import { RegistryEntry, RegistryItemFile } from '@gentleduck/registers'
import { Ora } from 'ora'

export interface GetComponentFilesParams extends Pick<GetFileParams, 'item' | 'spinner'> {
  idx: number
  registry_count: number
}

// Define the function arguments as a TypeScript type
export interface GetFileParams {
  file: RegistryItemFile
  item: RegistryEntry
  spinner: Ora
}

// Define the function arguments as a TypeScript type
export interface GetFileTargetParams extends GetFileParams {}

// Define the function arguments as a TypeScript type
export interface GetFileContentParams extends Pick<GetFileParams, 'file' | 'spinner'> {}

// Define the function arguments as a TypeScript type
export interface GenTempSourceFilesParams extends Pick<GetFileParams, 'file' | 'spinner'> {
  content?: string | undefined
}
