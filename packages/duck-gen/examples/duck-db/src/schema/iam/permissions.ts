import { sql } from 'drizzle-orm'
import { index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'

export const permissions = pgTable(
  'permissions',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    key: varchar('key', { length: 180 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [uniqueIndex('permission_key_unique').on(t.key), index('permission_key_idx').on(t.key)],
)
