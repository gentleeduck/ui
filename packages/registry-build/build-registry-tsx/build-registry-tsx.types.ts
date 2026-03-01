import type { registry_schema } from '@gentleduck/registers'
import type { Ora } from 'ora'
import type { z } from 'zod'

// The arguments required to fetch component files.
export type GetComponentFilesArgs = {
  item: z.infer<typeof registry_schema>['uis'][number]
  spinner: Ora
}

// The result of building a single TSX registry entry.
export type BuildRegistryTsxResult = { importLine: string; entry: string }

// The parameters for processing the file.
export type WriteIndexTsxParams = { tsx_content: string; spinner: Ora }
