import { sql } from 'drizzle-orm'
import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { identityProvider } from '../enums'
import { users } from './user'

/**
 * Auth methods live here (password, oauth, etc).
 * This keeps "user profile" separate from "how you log in".
 */
export const userIdentities = pgTable(
  'user_identities',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    provider: identityProvider('provider').notNull(),
    providerUserId: varchar('provider_user_id', { length: 255 }),
    passwordHash: varchar('password_hash', { length: 255 }),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('identity_provider_user_unique')
      .on(t.provider, t.providerUserId)
      .where(sql`provider_user_id IS NOT NULL AND deleted_at IS NULL`),
    index('identity_user_idx').on(t.userId, t.createdAt).where(sql`deleted_at IS NULL`),
  ],
)
