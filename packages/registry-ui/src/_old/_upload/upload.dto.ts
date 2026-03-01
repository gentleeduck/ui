//@ts-nocheck
import { z } from 'zod'

export const fileTypeSchema = z.object({
  createdAt: z.instanceof(Date),
  file: z.instanceof(File),
  id: z.string().uuid(),
  name: z.string(),
  size: z.string(),
  type: z.string(),
  updatedAt: z.instanceof(Date),
  url: z.string().nullable(),
})

export type FileSchemaType = z.infer<typeof fileTypeSchema>

export const attachmentSchema = fileTypeSchema.extend({
  treeLevel: z.number(),
})
