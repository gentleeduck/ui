import { z } from 'zod'
import {
  registry_entry_schema,
  registry_item_file_schema,
  registry_schema,
} from '@duck/registers'

// Define the function arguments as a TypeScript type
export interface BuildRegistryComponentsParams {
  item: z.infer<typeof registry_schema>[number]
}

// Define the function arguments as a TypeScript type
export interface GetFileParams {
  file: z.infer<typeof registry_item_file_schema>
  item: z.infer<typeof registry_entry_schema>
}

// Define the function arguments as a TypeScript type
export interface GetFileTargetParams {
  item: z.infer<typeof registry_entry_schema>
  file: z.infer<typeof registry_item_file_schema>
}

// Define the function arguments as a TypeScript type
export interface GetFileContentParams {
  file: z.infer<typeof registry_item_file_schema>
}

// Define the function arguments as a TypeScript type
export interface GenTempSourceFilesParams {
  file: z.infer<typeof registry_item_file_schema>
  content?: string | undefined
}
