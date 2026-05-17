import { datetime, index, int, json, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'

/**
 * MySQL schema for duck-iam Drizzle adapter.
 *
 * MySQL has no native array type - `inherits` is stored as a JSON array
 * (the adapter handles JSON.parse automatically).
 */

/**
 * Defines the Drizzle MySQL table for stored policies.
 *
 * JSON columns (`rules`, `targets`) carry the policy payload.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const accessPolicies = mysqlTable('access_policies', {
  id: varchar('id', { length: 191 }).primaryKey(),
  name: varchar('name', { length: 191 }).notNull(),
  description: varchar('description', { length: 1024 }),
  version: int('version').notNull().default(1),
  algorithm: varchar('algorithm', { length: 32 }).notNull().default('deny-overrides'),
  rules: json('rules').notNull(),
  targets: json('targets'),
  createdAt: datetime('created_at', { fsp: 3 }).notNull().default(new Date()),
  updatedAt: datetime('updated_at', { fsp: 3 })
    .notNull()
    .default(new Date())
    .$onUpdate(() => new Date()),
})

/**
 * Defines the Drizzle MySQL table for stored roles.
 *
 * `inherits` is JSON since MySQL has no native array type.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const accessRoles = mysqlTable('access_roles', {
  id: varchar('id', { length: 191 }).primaryKey(),
  name: varchar('name', { length: 191 }).notNull(),
  description: varchar('description', { length: 1024 }),
  permissions: json('permissions').notNull(),
  inherits: json('inherits').notNull(),
  scope: varchar('scope', { length: 191 }),
  metadata: json('metadata'),
  createdAt: datetime('created_at', { fsp: 3 }).notNull().default(new Date()),
  updatedAt: datetime('updated_at', { fsp: 3 })
    .notNull()
    .default(new Date())
    .$onUpdate(() => new Date()),
})

/**
 * Defines the Drizzle MySQL table for subject-to-role assignments.
 *
 * Unique on `(subject_id, role_id, scope)`.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const accessAssignments = mysqlTable(
  'access_assignments',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    subjectId: varchar('subject_id', { length: 191 }).notNull(),
    roleId: varchar('role_id', { length: 191 }).notNull(),
    scope: varchar('scope', { length: 191 }),
    createdAt: datetime('created_at', { fsp: 3 }).notNull().default(new Date()),
  },
  (t) => [
    uniqueIndex('access_assignments_subject_role_scope_idx').on(t.subjectId, t.roleId, t.scope),
    index('access_assignments_subject_idx').on(t.subjectId),
  ],
)

/**
 * Defines the Drizzle MySQL table for per-subject attribute bags.
 *
 * One row per subject.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const accessSubjectAttrs = mysqlTable('access_subject_attrs', {
  subjectId: varchar('subject_id', { length: 191 }).primaryKey(),
  data: json('data').notNull(),
  updatedAt: datetime('updated_at', { fsp: 3 })
    .notNull()
    .default(new Date())
    .$onUpdate(() => new Date()),
})
