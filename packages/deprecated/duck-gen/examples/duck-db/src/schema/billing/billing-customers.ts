import { sql } from 'drizzle-orm'
import { pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { tenants } from '../tanants'

export const billingCustomers = pgTable(
  'billing_customers',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),

    provider: varchar('provider', { length: 60 }).notNull(),
    providerCustomerId: varchar('provider_customer_id', { length: 200 }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [
    uniqueIndex('billing_customer_unique').on(t.provider, t.providerCustomerId),
    uniqueIndex('billing_customer_tenant_unique').on(t.tenantId, t.provider),
  ],
)
