import { Database } from 'bun:sqlite'
import { allRoles } from './access'
import { accessAssignments, accessRoles, db, posts, users } from './db'

const dbPath = new URL('../data.db', import.meta.url).pathname
const sqlite = new Database(dbPath)

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer'
  );
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    author_id TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS access_roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    permissions TEXT NOT NULL,
    inherits TEXT NOT NULL DEFAULT '[]',
    scope TEXT,
    metadata TEXT
  );
  CREATE TABLE IF NOT EXISTS access_policies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    algorithm TEXT NOT NULL,
    rules TEXT NOT NULL,
    targets TEXT
  );
  CREATE TABLE IF NOT EXISTS access_assignments (
    subject_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    scope TEXT
  );
  CREATE TABLE IF NOT EXISTS access_subject_attrs (
    subject_id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
`)

sqlite.exec(`
  DELETE FROM access_assignments;
  DELETE FROM access_roles;
  DELETE FROM posts;
  DELETE FROM users;
`)

for (const role of allRoles) {
  db.insert(accessRoles)
    .values({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: JSON.stringify(role.permissions),
      inherits: JSON.stringify(role.inherits ?? []),
      scope: role.scope,
      metadata: role.metadata ? JSON.stringify(role.metadata) : null,
    })
    .run()
}

db.insert(users)
  .values([
    { id: 'alice', name: 'Alice', role: 'viewer' },
    { id: 'bob', name: 'Bob', role: 'editor' },
    { id: 'charlie', name: 'Charlie', role: 'admin' },
  ])
  .run()

db.insert(accessAssignments)
  .values([
    { subjectId: 'alice', roleId: 'viewer', scope: null },
    { subjectId: 'bob', roleId: 'editor', scope: null },
    { subjectId: 'charlie', roleId: 'admin', scope: null },
  ])
  .run()

db.insert(posts)
  .values([
    { title: 'Hello World', body: 'This is the first post.', authorId: 'alice' },
    { title: 'Getting Started with duck-iam', body: 'Authorization made simple.', authorId: 'bob' },
    { title: 'Admin Announcement', body: 'System maintenance tomorrow.', authorId: 'charlie' },
  ])
  .run()

console.log('Database seeded!')
console.log('')
console.log('Users:')
console.log('  alice   (viewer) — can read posts')
console.log('  bob     (editor) — can read + create + update posts')
console.log('  charlie (admin)  — can do everything')
