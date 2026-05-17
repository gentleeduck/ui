import { sql } from 'drizzle-orm'
import { index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

/**
 * PostgreSQL schema for duck-iam Drizzle adapter.
 *
 * Import these tables into your db.ts and pass them to DrizzleAdapter:
 *
 * ```ts
 * import { drizzle } from 'drizzle-orm/node-postgres'
 * import { eq, and } from 'drizzle-orm'
 * import { DrizzleAdapter } from '@gentleduck/iam/adapters/drizzle'
 * import { accessPolicies, accessRoles, accessAssignments, accessSubjectAttrs } from '@gentleduck/iam/adapters/drizzle/schema/pg'
 *
 * const db = drizzle(pool)
 * const adapter = new DrizzleAdapter({
 *   db,
 *   tables: { policies: accessPolicies, roles: accessRoles, assignments: accessAssignments, attrs: accessSubjectAttrs },
 *   ops: { eq, and },
 * })
 * ```
 *
 * Generate migrations with `drizzle-kit generate` against this schema.
 */

/**
 * Defines the Drizzle Postgres table for stored policies.
 *
 * JSON columns (`rules`, `targets`) carry the policy payload.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const accessPolicies = pgTable('access_policies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  version: integer('version').notNull().default(1),
  algorithm: text('algorithm').notNull().default('deny-overrides'),
  rules: jsonb('rules').notNull(),
  targets: jsonb('targets'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

/**
 * Defines the Drizzle Postgres table for stored roles.
 *
 * `inherits` is a `text[]` column for fast lookups.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const accessRoles = pgTable('access_roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  permissions: jsonb('permissions').notNull(),
  inherits: text('inherits').array().notNull().default(sql`ARRAY[]::text[]`),
  scope: text('scope'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

/**
 * Defines the Drizzle Postgres table for subject-to-role assignments.
 *
 * Unique on `(subject_id, role_id, scope)`.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const accessAssignments = pgTable(
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
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('access_assignments_subject_role_scope_idx').on(t.subjectId, t.roleId, t.scope),
    index('access_assignments_subject_idx').on(t.subjectId),
  ],
)

/**
 * Defines the Drizzle Postgres table for per-subject attribute bags.
 *
 * One row per subject.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const accessSubjectAttrs = pgTable('access_subject_attrs', {
  subjectId: text('subject_id').primaryKey(),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
