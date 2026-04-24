import { sql } from 'drizzle-orm'
import { boolean, index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { tenants } from './tenants'

export const tenantDomains = pgTable(
  'tenant_domains',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),

    domain: varchar('domain', { length: 255 }).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('tenant_domain_unique_active').on(t.domain).where(sql`deleted_at IS NULL`),
    index('tenant_domains_tenant_idx').on(t.tenantId, t.createdAt).where(sql`deleted_at IS NULL`),
  ],
)
