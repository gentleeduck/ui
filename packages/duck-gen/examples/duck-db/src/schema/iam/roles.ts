import { sql } from 'drizzle-orm'
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { roleScope } from '../enums'
import { tenants } from '../tanants'

export const roles = pgTable(
  'roles',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),

    scope: roleScope('scope').default('tenant').notNull(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 120 }).notNull(),
    description: text('description'),

    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('role_name_unique_per_tenant_active')
      .on(t.tenantId, t.name)
      .where(sql`deleted_at IS NULL AND scope = 'tenant'`),
    uniqueIndex('role_name_unique_system_active').on(t.name).where(sql`deleted_at IS NULL AND scope = 'system'`),
    index('roles_tenant_idx').on(t.tenantId).where(sql`deleted_at IS NULL`),
    check(
      'roles_scope_tenant_check',
      sql`(scope='system' AND tenant_id IS NULL) OR (scope='tenant' AND tenant_id IS NOT NULL)`,
    ),
  ],
)
