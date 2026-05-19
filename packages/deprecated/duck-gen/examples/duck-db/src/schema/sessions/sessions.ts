import { sql } from 'drizzle-orm'
import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { sessionStatus } from '../enums'
import { tenants } from '../tanants'
import { users } from '../user'

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'set null' }),
    status: sessionStatus('status').default('active').notNull(),
    sessionTokenHash: varchar('session_token_hash', { length: 255 }).notNull(),
    ip: varchar('ip', { length: 64 }),
    userAgent: varchar('user_agent', { length: 1024 }),

    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('sessions_token_hash_unique').on(t.sessionTokenHash).where(sql`deleted_at IS NULL`),
    index('sessions_token_hash_idx').on(t.sessionTokenHash).where(sql`deleted_at IS NULL`),

    index('sessions_user_idx').on(t.userId, t.createdAt).where(sql`deleted_at IS NULL`),
    index('sessions_tenant_idx').on(t.tenantId, t.createdAt).where(sql`deleted_at IS NULL`),
    index('sessions_status_idx').on(t.status).where(sql`deleted_at IS NULL`),
    index('sessions_expires_idx').on(t.expiresAt).where(sql`deleted_at IS NULL`),
  ],
)
