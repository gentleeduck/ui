import { relations } from 'drizzle-orm'
import { tenants } from '../tanants'
import { users } from '../user'
import { fileLinks } from './file-links'
import { fileObjects } from './file-objects'

export const fileObjectsRelations = relations(fileObjects, ({ one, many }) => ({
  tenant: one(tenants, { fields: [fileObjects.tenantId], references: [tenants.id] }),
  owner: one(users, { fields: [fileObjects.ownerUserId], references: [users.id] }),
  links: many(fileLinks),
}))

export const fileLinksRelations = relations(fileLinks, ({ one }) => ({
  tenant: one(tenants, { fields: [fileLinks.tenantId], references: [tenants.id] }),
  owner: one(users, { fields: [fileLinks.ownerUserId], references: [users.id] }),
  file: one(fileObjects, { fields: [fileLinks.fileId], references: [fileObjects.id] }),
}))
