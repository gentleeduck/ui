import { registry_schema } from '@gentleduck/registers'
import { Ora } from 'ora'
import { z } from 'zod'

// The arguments required to fetch component files.
export type GetComponentFilesArgs = {
  item: z.infer<typeof registry_schema>[number]
  spinner: Ora
}

// The parameters for processing the file.
export type WriteIndexTsxParams = { tsx_content: string; spinner: Ora }
