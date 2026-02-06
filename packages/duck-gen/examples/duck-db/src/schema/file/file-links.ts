import { sql } from 'drizzle-orm'
import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { tenants } from '../tanants'
import { users } from '../user'
import { fileObjects } from './file-objects'

export const fileLinks = pgTable(
  'file_links',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    ownerUserId: uuid('owner_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    fileId: uuid('file_id')
      .notNull()
      .references(() => fileObjects.id, { onDelete: 'cascade' }),

    entityType: varchar('entity_type', { length: 64 }).notNull(),
    entityId: uuid('entity_id').notNull(),
    field: varchar('field', { length: 64 }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('file_links_unique_tenant_scoped')
      .on(t.tenantId, t.entityType, t.entityId, t.field)
      .where(sql`${t.tenantId} is not null`),

    uniqueIndex('file_links_unique_global_scoped')
      .on(t.entityType, t.entityId, t.field)
      .where(sql`${t.tenantId} is null`),

    index('file_links_file_id_idx').on(t.fileId),
    index('file_links_entity_idx').on(t.tenantId, t.entityType, t.entityId),
  ],
)
