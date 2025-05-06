import { z } from 'zod'
import { registry_entry_schema, registry_item_file_schema, registry_schema } from '@gentleduck/registers'
import { Ora } from 'ora'

export type GetComponentFilesParams = {
  item: z.infer<typeof registry_schema>[number]
  spinner: Ora
  idx: number
  registry_count: number
}

// Define the function arguments as a TypeScript type
export interface GetFileParams {
  file: z.infer<typeof registry_item_file_schema>
  item: z.infer<typeof registry_entry_schema>
  spinner: Ora
}

// Define the function arguments as a TypeScript type
export interface GetFileTargetParams {
  item: z.infer<typeof registry_entry_schema>
  file: z.infer<typeof registry_item_file_schema>
  spinner: Ora
}

// Define the function arguments as a TypeScript type
export type GetFileContentParams = {
  file: z.infer<typeof registry_item_file_schema>
  spinner: Ora
}

// Define the function arguments as a TypeScript type
export interface GenTempSourceFilesParams {
  file: z.infer<typeof registry_item_file_schema>
  content?: string | undefined
  spinner: Ora
}
