import { z } from 'zod'

export const newFolderSchema = z.object({
  folderName: z.string().min(1, { message: 'Name is required' }),
})

export type NewFolderSchemaType = z.infer<typeof newFolderSchema>

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
