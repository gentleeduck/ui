import { sql } from 'drizzle-orm'
import { index, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { auditActorType } from '../enums'
import { apiKeys } from '../sessions'
import { tenants } from '../tanants'
import { users } from '../user'

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'set null' }),

    actorType: auditActorType('actor_type').default('user').notNull(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    actorApiKeyId: uuid('actor_api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),

    action: varchar('action', { length: 180 }).notNull(),
    targetType: varchar('target_type', { length: 80 }),
    targetId: uuid('target_id'),

    requestId: varchar('request_id', { length: 80 }),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`).notNull(),

    ip: varchar('ip', { length: 64 }),
    userAgent: text('user_agent'),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [
    index('audit_tenant_created_idx').on(t.tenantId, t.createdAt),
    index('audit_actor_user_created_idx').on(t.actorUserId, t.createdAt),
    index('audit_action_created_idx').on(t.action, t.createdAt),
  ],
)
