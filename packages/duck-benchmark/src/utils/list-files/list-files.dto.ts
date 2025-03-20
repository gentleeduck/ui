import { z } from 'zod'

export const fileInfoSchema = z.object({
  name: z.string(),
  path: z.string(),
  size: z.number(),
  createdAt: z.date(),
  modifiedAt: z.date(),
  isDirectory: z.boolean(),
  compileTimeMs: z.number().optional(),
  bundleSize: z.number().optional(),
  errors: z.array(z.string()).optional(),
  compile_info: z
    .object({
      compileTimeMs: z.number(),
      bundleSize: z.number(),
    })
    .optional(),
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
