import { pgTable } from 'drizzle-orm/pg-core/table'
import { char, integer, pgEnum, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

// Users Table
const users = pgTable('users', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: char('password', { length: 256 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// Buckets Table
const buckets = pgTable('buckets', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),

  user_id: uuid('user_id').notNull(),
})

// Files Table
const files = pgTable('files', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url'),
  type: varchar('type', { length: 255 }).notNull(),
  size: integer('size'),
  tree_level: integer('tree_level').default(1),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),

  folder_id: uuid('folder_id'),
  bucket_id: uuid('bucket_id').notNull(),
})

// Folders Table
const folders = pgTable('folders', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  files_count: integer('files_count').default(0).notNull(),
  tree_level: integer('tree_level').default(1).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),

  folder_id: uuid('folder_id'),
  bucket_id: uuid('bucket_id').notNull(),
})

export { buckets, files, folders, users }
