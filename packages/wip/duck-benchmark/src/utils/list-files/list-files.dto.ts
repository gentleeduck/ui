import { z } from 'zod'

export const fileInfoSchema = z.object({
  bundleSize: z.number().optional(),
  compileTimeMs: z.number().optional(),
  created_at: z.date(),
  errors: z.array(z.string()).optional(),
  modified_at: z.date(),
  name: z.string(),
  path: z.string(),
  renderTimeMs: z.number().optional(),
  size: z.number(),
})

export type FileInfo = z.infer<typeof fileInfoSchema>

// Base schema for a folder (without recursion)
export const baseFolderSchema = z.object({
  createdAt: z.date(),
  files: z.array(fileInfoSchema),
  modifiedAt: z.date(),
  name: z.string(),
  path: z.string(),
})

export const folderInfoSchema: z.ZodType<FolderInfo> = baseFolderSchema.extend({
  subdirectories: z.lazy(() => folderInfoSchema.array()), // Recursive reference
})

// Recursive schema for the full folder structure
export type FolderInfo = z.infer<typeof baseFolderSchema> & {
  subdirectories: FolderInfo[]
}
