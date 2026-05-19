import { sql } from 'drizzle-orm'
import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { inviteStatus } from '../enums'
import { users } from '../user'
import { tenants } from './tenants'

/**
 * Tenant invites: needed for team onboarding + resend/revoke/list in admin.
 * We store only a hash of the invite token.
 */
export const tenantInvites = pgTable(
  'tenant_invites',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),

    email: varchar('email', { length: 255 }).notNull(),

    invitedByUserId: uuid('invited_by_user_id').references(() => users.id, { onDelete: 'set null' }),
    acceptedByUserId: uuid('accepted_by_user_id').references(() => users.id, { onDelete: 'set null' }),

    inviteTokenHash: varchar('invite_token_hash', { length: 255 }).notNull(),

    status: inviteStatus('status').default('pending').notNull(),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [
    uniqueIndex('tenant_invite_token_hash_unique').on(t.inviteTokenHash),
    uniqueIndex('tenant_invite_pending_unique').on(t.tenantId, t.email).where(sql`status = 'pending'`),
    index('tenant_invites_tenant_idx').on(t.tenantId, t.createdAt),
    index('tenant_invites_expires_idx').on(t.expiresAt),
  ],
)
