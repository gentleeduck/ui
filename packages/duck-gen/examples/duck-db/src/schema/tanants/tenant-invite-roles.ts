import { sql } from 'drizzle-orm'
import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core'
import { roles } from '../iam'
import { tenantInvites } from './tenant-invites'

/**
 * Multi-role assignment on invite.
 * On accept: create membership, then copy these roles into membership_roles.
 */
export const tenantInviteRoles = pgTable(
  'tenant_invite_roles',
  {
    inviteId: uuid('invite_id')
      .notNull()
      .references(() => tenantInvites.id, { onDelete: 'cascade' }),

    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [primaryKey({ columns: [t.inviteId, t.roleId], name: 'tenant_invite_roles_pk' })],
)
