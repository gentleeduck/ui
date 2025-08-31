import { registry_schema } from '@gentleduck/registers'
import { Ora } from 'ora'
import { z } from 'zod'

// BuildRegistryStylesIndexParams - Define the function arguments as a TypeScript type
export type BuildRegistryStylesIndexParams = {
  item: z.infer<typeof registry_schema>[number]
  spinner: Ora
}
