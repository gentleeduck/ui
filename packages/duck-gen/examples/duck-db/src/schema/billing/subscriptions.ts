import { sql } from 'drizzle-orm'
import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { tenants } from '../tanants'

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),

    provider: varchar('provider', { length: 60 }).notNull(),
    providerSubscriptionId: varchar('provider_subscription_id', { length: 200 }).notNull(),

    planKey: varchar('plan_key', { length: 80 }).notNull(),
    status: varchar('status', { length: 40 }).notNull(),

    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [
    uniqueIndex('subscription_provider_unique').on(t.provider, t.providerSubscriptionId),
    index('subscription_tenant_idx').on(t.tenantId, t.createdAt),
  ],
)
