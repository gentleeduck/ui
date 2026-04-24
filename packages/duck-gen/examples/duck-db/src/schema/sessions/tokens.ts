import { sql } from 'drizzle-orm'
import { index, integer, jsonb, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { tokenPurpose, tokenStatus } from '../enums'
import { tenants } from '../tanants'
import { users } from '../user'

export const tokens = pgTable(
  'tokens',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),

    purpose: tokenPurpose('purpose').notNull(),
    status: tokenStatus('status').default('active').notNull(),
    tokenHash: varchar('token_hash', { length: 255 }).notNull(),
    attempts: integer('attempts').default(0).notNull(),
    meta: jsonb('meta').default(sql`'{}'::jsonb`).notNull(),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [
    uniqueIndex('tokens_token_hash_unique').on(t.tokenHash),
    index('tokens_user_purpose_idx').on(t.userId, t.purpose, t.createdAt),
    index('tokens_tenant_purpose_idx').on(t.tenantId, t.purpose, t.createdAt),
    index('tokens_expires_idx').on(t.expiresAt),
    index('tokens_user_purpose_status_kind_idx').on(t.userId, t.purpose, t.status, sql`(${t.meta}->>'kind')`),
  ],
)
