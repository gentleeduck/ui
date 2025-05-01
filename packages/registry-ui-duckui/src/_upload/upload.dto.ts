//@ts-nocheck
import { z } from 'zod'

export const fileTypeSchema = z.object({
  id: z.string().uuid(),
  file: z.instanceof(File),
  name: z.string(),
  url: z.string().nullable(),
  type: z.string(),
  size: z.string(),
  createdAt: z.instanceof(Date),
  updatedAt: z.instanceof(Date),
})

export type FileSchemaType = z.infer<typeof fileTypeSchema>

export const attachmentSchema = fileTypeSchema.extend({
  treeLevel: z.number(),
})
