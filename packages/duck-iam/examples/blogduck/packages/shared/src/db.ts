import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// ── Schema ──────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull().default('viewer'),
})

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  authorId: text('author_id').notNull(),
})

// duck-iam tables
export const accessRoles = sqliteTable('access_roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  permissions: text('permissions').notNull(),
  inherits: text('inherits').notNull().default('[]'),
  scope: text('scope'),
  metadata: text('metadata'),
})

export const accessPolicies = sqliteTable('access_policies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  version: integer('version').notNull().default(1),
  algorithm: text('algorithm').notNull(),
  rules: text('rules').notNull(),
  targets: text('targets'),
})

export const accessAssignments = sqliteTable('access_assignments', {
  subjectId: text('subject_id').notNull(),
  roleId: text('role_id').notNull(),
  scope: text('scope'),
})

export const accessSubjectAttrs = sqliteTable('access_subject_attrs', {
  subjectId: text('subject_id').primaryKey(),
  data: text('data').notNull(),
})

// ── Database connection ─────────────────────────────────────────

const dbPath = new URL('../data.db', import.meta.url).pathname
const sqlite = new Database(dbPath)
export const db = drizzle({ client: sqlite })
