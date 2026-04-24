import { sql } from 'drizzle-orm'
import { index, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { membershipStatus } from '../enums'
import { users } from '../user'
import { tenants } from './tenants'

export const memberships = pgTable(
  'memberships',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    status: membershipStatus('status').default('active').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('membership_unique_active').on(t.tenantId, t.userId).where(sql`deleted_at IS NULL`),
    index('membership_tenant_idx').on(t.tenantId).where(sql`deleted_at IS NULL`),
    index('membership_user_idx').on(t.userId).where(sql`deleted_at IS NULL`),
    index('membership_status_idx').on(t.status).where(sql`deleted_at IS NULL`),
  ],
)
