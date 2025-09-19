import { relations } from 'drizzle-orm/relations'
import { buckets, files, folders, users } from './schema'

// Users Relations
export const usersRelations = relations(users, ({ many }) => ({
  buckets: many(buckets, {
    relationName: 'user_buckets',
  }),
}))

// Buckets Relations
export const bucketsRelations = relations(buckets, ({ one, many }) => ({
  files: many(files, {
    relationName: 'bucket_files',
  }),
  folders: many(folders, {
    relationName: 'bucket_folders',
  }),
  user: one(users, {
    fields: [buckets.user_id],
    references: [users.id],
  }),
}))

// Files Relations
export const filesRelations = relations(files, ({ one }) => ({
  bucket: one(buckets, {
    fields: [files.bucket_id],
    references: [buckets.id],
  }),
  folder: one(folders, {
    fields: [files.folder_id],
    references: [folders.id],
  }),
}))

// Folders Relations
export const foldersRelations = relations(folders, ({ one, many }) => ({
  bucket: one(buckets, {
    fields: [folders.bucket_id],
    references: [buckets.id],
  }),
  files: many(files, {
    relationName: 'folder_files',
  }),
  parentFolder: one(folders, {
    fields: [folders.folder_id],
    references: [folders.id],
  }),
}))
