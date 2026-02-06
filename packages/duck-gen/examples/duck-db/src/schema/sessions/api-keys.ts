import { sql } from 'drizzle-orm'
import { boolean, index, integer, jsonb, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { apiKeyKind, apiKeyScope } from '../enums'
import { tenants } from '../tanants'
import { users } from '../user'

export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, { onDelete: 'set null' }),

    name: varchar('name', { length: 120 }).notNull(),
    kind: apiKeyKind('kind').default('public').notNull(),
    scope: apiKeyScope('scope').default('anon').notNull(),

    keyHash: varchar('key_hash', { length: 255 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    rateLimitWindowMs: integer('rate_limit_window_ms').default(60_000).notNull(),
    rateLimitMax: integer('rate_limit_max').default(60).notNull(),
    restrictions: jsonb('restrictions').default(sql`'{}'::jsonb`).notNull(),

    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('api_keys_key_hash_unique_active').on(t.keyHash).where(sql`deleted_at IS NULL`),

    index('api_keys_expires_idx').on(t.expiresAt).where(sql`deleted_at IS NULL`),
    index('api_keys_tenant_idx').on(t.tenantId).where(sql`deleted_at IS NULL`),
    index('api_keys_active_idx').on(t.isActive).where(sql`deleted_at IS NULL`),
    index('api_keys_last_used_idx').on(t.lastUsedAt).where(sql`deleted_at IS NULL`),
    index('api_keys_scope_idx').on(t.scope).where(sql`deleted_at IS NULL`),
  ],
)
