import { registry_schema } from '@gentleduck/registers'
import { Ora } from 'ora'
import { z } from 'zod'

// Define the function arguments as a TypeScript type
export type GetComponentFilesArgs = {
  item: z.infer<typeof registry_schema>[0]
  type: z.infer<typeof registry_schema>[0]['type']
  spinner: Ora
  idx: number
  registry_count: number
}

// Define the function arguments as a TypeScript type
export type BuildRegistryIndexParams = {
  registry: z.infer<typeof registry_schema>
  spinner: Ora
}
