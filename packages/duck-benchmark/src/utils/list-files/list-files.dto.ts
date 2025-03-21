import { z } from 'zod'

export const fileInfoSchema = z.object({
  name: z.string(),
  path: z.string(),
  size: z.number(),
  created_at: z.date(),
  modified_at: z.date(),
  compile_time_ms: z.number().optional(),
  render_time_ms: z.number().optional(),
  bundle_size: z.number().optional(),
  errors: z.array(z.string()).optional(),
})

export type FileInfo = z.infer<typeof fileInfoSchema>

// Base schema for a folder (without recursion)
export const baseFolderSchema = z.object({
  name: z.string(),
  path: z.string(),
  createdAt: z.date(),
  modifiedAt: z.date(),
  files: z.array(fileInfoSchema),
})

export const folderInfoSchema: z.ZodType<FolderInfo> = baseFolderSchema.extend({
  subdirectories: z.lazy(() => folderInfoSchema.array()), // Recursive reference
})

// Recursive schema for the full folder structure
export type FolderInfo = z.infer<typeof baseFolderSchema> & {
  subdirectories: FolderInfo[]
}
