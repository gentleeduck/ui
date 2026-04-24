import { sql } from 'drizzle-orm'
import { index, jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { tenants } from '../tanants'
import { users } from '../user'
import { apiKeys } from './api-keys'

export const apiKeyEvents = pgTable(
  'api_key_events',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    apiKeyId: uuid('api_key_id')
      .notNull()
      .references(() => apiKeys.id, { onDelete: 'cascade' }),

    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'set null' }),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),

    action: varchar('action', { length: 120 }).notNull(),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [
    index('api_key_events_key_idx').on(t.apiKeyId, t.createdAt),
    index('api_key_events_tenant_idx').on(t.tenantId, t.createdAt),
    index('api_key_events_actor_idx').on(t.actorUserId, t.createdAt),
  ],
)
