import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

/**
 * SQLite schema for duck-iam Drizzle adapter.
 *
 * SQLite has no native JSON or array type — JSON columns (rules, permissions,
 * targets, metadata, inherits, data) are stored as TEXT and the adapter
 * serializes/deserializes them automatically.
 */

export const accessPolicies = sqliteTable('access_policies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  version: integer('version').notNull().default(1),
  algorithm: text('algorithm').notNull().default('deny-overrides'),
  rules: text('rules').notNull(),
  targets: text('targets'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => new Date()),
})

export const accessRoles = sqliteTable('access_roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  permissions: text('permissions').notNull(),
  inherits: text('inherits').notNull().default('[]'),
  scope: text('scope'),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => new Date()),
})

export const accessAssignments = sqliteTable(
  'access_assignments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    subjectId: text('subject_id').notNull(),
    roleId: text('role_id')
      .notNull()
      .references(() => accessRoles.id, { onDelete: 'cascade' }),
    scope: text('scope'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`),
  },
  (t) => [
    uniqueIndex('access_assignments_subject_role_scope_idx').on(t.subjectId, t.roleId, t.scope),
    index('access_assignments_subject_idx').on(t.subjectId),
  ],
)

export const accessSubjectAttrs = sqliteTable('access_subject_attrs', {
  subjectId: text('subject_id').primaryKey(),
  data: text('data').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => new Date()),
})
