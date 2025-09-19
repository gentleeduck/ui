import { char, integer, pgEnum, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core/table'
import { uuidv7 } from 'uuidv7'

// Users Table
const users = pgTable('users', {
  created_at: timestamp('created_at').notNull().defaultNow(),
  email: varchar('email', { length: 255 }).notNull(),
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  password: char('password', { length: 256 }).notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// Buckets Table
const buckets = pgTable('buckets', {
  created_at: timestamp('created_at').notNull().defaultNow(),
  description: text('description'),
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),

  user_id: uuid('user_id').notNull(),
})

// Files Table
const files = pgTable('files', {
  bucket_id: uuid('bucket_id').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),

  folder_id: uuid('folder_id'),
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  size: integer('size'),
  tree_level: integer('tree_level').default(1),
  type: varchar('type', { length: 255 }).notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  url: varchar('url'),
})

// Folders Table
const folders = pgTable('folders', {
  bucket_id: uuid('bucket_id').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  files_count: integer('files_count').default(0).notNull(),

  folder_id: uuid('folder_id'),
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  tree_level: integer('tree_level').default(1).notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

export { buckets, files, folders, users }
