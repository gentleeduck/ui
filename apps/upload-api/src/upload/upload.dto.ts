import { z } from 'zod'

// NOTE: GETTTERs
export const getBucketsSchema = z.object({
  user_id: z.string().uuid(),
})
export type GetBucketsType = z.infer<typeof getBucketsSchema>

export const getBucketSchema = z.object({
  bucket_id: z.string().uuid(),
})
export type GetBucketType = z.infer<typeof getBucketSchema>

export const getFolderSchema = z.object({
  bucket_id: z.string().uuid(),
  folder_id: z.string().uuid().nullable(),
})
export type GetFolderType = z.infer<typeof getFolderSchema>

// NOTE: INSERTERs && UPDATERs
export const insertBucketSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  user_id: z.string().uuid(),
})
export type InsertBucketType = z.infer<typeof insertBucketSchema>

export const insertFileSchema = getFolderSchema.extend({
  id: z.string().uuid(),
  file: z.string(),
  //TODO: make the function takes the link and get it's binary and
  // store it in the database and upload it to the MINIO.
  // url: z.string().optional().nullable(),
  type: z.string(),
  name: z.string(),
  size: z.number(),
  tree_level: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})
export type InsertFileType = z.infer<typeof insertFileSchema>

export const insertFolderSchema = getFolderSchema.extend({
  id: z.string().uuid(),
  name: z.string(),
  tree_level: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})
export type InsertFolderType = z.infer<typeof insertFolderSchema>

// NOTE: DELETERs
export const deleteBucketSchema = z.object({
  id: z.string().uuid(),
})
export type DeleteBucketType = z.infer<typeof deleteBucketSchema>

export const deleteFileSchema = z.object({
  id: z.string().uuid(),
})
export type DeleteFileType = z.infer<typeof deleteFileSchema>

export const deleteFolderSchema = z.object({
  id: z.string().uuid(),
})
export type DeleteFolderType = z.infer<typeof deleteFolderSchema>
