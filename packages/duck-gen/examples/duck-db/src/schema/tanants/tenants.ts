import { sql } from 'drizzle-orm'
import { boolean, index, jsonb, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { users } from '../user'

export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    name: varchar('name', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 120 }).notNull(),

    ownerUserId: uuid('owner_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),

    isActive: boolean('is_active').default(true).notNull(),
    settings: jsonb('settings').default(sql`'{}'::jsonb`),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('tenant_slug_unique_active').on(t.slug).where(sql`deleted_at IS NULL`),
    index('tenant_owner_idx').on(t.ownerUserId),
    index('tenant_active_idx').on(t.isActive).where(sql`deleted_at IS NULL`),
  ],
)
