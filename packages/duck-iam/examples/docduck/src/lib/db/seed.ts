import { hashPassword } from 'better-auth/crypto'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { allPolicies, allRoles } from '../access'
import {
  accessAssignments,
  accessPolicies,
  accessRoles,
  accessSubjectAttrs,
  accounts,
  documents,
  users,
  workspaceMembers,
  workspaces,
} from './schema'

const connectionString = process.env.DATABASE_URL ?? 'postgresql://docduck:docduck@localhost:5488/docduck'
const client = postgres(connectionString)
const db = drizzle(client)

async function seed() {
  console.log('Creating tables...')

  // Create all tables
  await client.unsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL DEFAULT false,
      image TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      expires_at TIMESTAMP NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now(),
      ip_address TEXT,
      user_agent TEXT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      access_token TEXT,
      refresh_token TEXT,
      id_token TEXT,
      access_token_expires_at TIMESTAMP,
      refresh_token_expires_at TIMESTAMP,
      scope TEXT,
      password TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS verifications (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS workspace_members (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'viewer',
      joined_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT 'Untitled',
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_public BOOLEAN NOT NULL DEFAULT false,
      content BYTEA,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS access_roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      permissions JSONB NOT NULL,
      inherits JSONB NOT NULL DEFAULT '[]',
      scope TEXT,
      metadata JSONB
    );

    CREATE TABLE IF NOT EXISTS access_policies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      version INTEGER NOT NULL DEFAULT 1,
      algorithm TEXT NOT NULL,
      rules JSONB NOT NULL,
      targets JSONB
    );

    CREATE TABLE IF NOT EXISTS access_assignments (
      subject_id TEXT NOT NULL,
      role_id TEXT NOT NULL,
      scope TEXT
    );

    CREATE TABLE IF NOT EXISTS access_subject_attrs (
      subject_id TEXT PRIMARY KEY,
      data JSONB NOT NULL
    );
  `)

  console.log('Cleaning existing data...')
  await db.delete(accessAssignments)
  await db.delete(accessSubjectAttrs)
  await db.delete(accessPolicies)
  await db.delete(accessRoles)
  await db.delete(documents)
  await db.delete(workspaceMembers)
  await db.delete(workspaces)
  await db.delete(accounts)
  await db.execute(sql`DELETE FROM sessions`)
  await db.delete(users)

  console.log('Seeding users...')
  // Password hash for "password123" using better-auth's default bcrypt
  // In seed we insert directly - users can also register via the UI
  const demoUsers = [
    { id: 'user-alice', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'user-bob', name: 'Bob Smith', email: 'bob@example.com' },
    { id: 'user-charlie', name: 'Charlie Davis', email: 'charlie@example.com' },
    { id: 'user-diana', name: 'Diana Lee', email: 'diana@example.com' },
  ]

  await db.insert(users).values(demoUsers)

  // Create credential accounts using better-auth's own hash function
  const passwordHash = await hashPassword('password123')

  await db.insert(accounts).values(
    demoUsers.map((u) => ({
      id: `account-${u.id}`,
      accountId: u.id,
      providerId: 'credential',
      userId: u.id,
      password: passwordHash,
    })),
  )

  console.log('Seeding workspaces...')
  await db.insert(workspaces).values([
    { id: 'ws-acme', name: 'Acme Corp', slug: 'acme', ownerId: 'user-alice' },
    { id: 'ws-startup', name: 'Startup Inc', slug: 'startup', ownerId: 'user-bob' },
  ])

  console.log('Seeding workspace members...')
  await db.insert(workspaceMembers).values([
    // Acme Corp: Alice=owner, Bob=editor, Charlie=viewer, Diana=admin
    { id: 'wm-1', workspaceId: 'ws-acme', userId: 'user-alice', role: 'owner' },
    { id: 'wm-2', workspaceId: 'ws-acme', userId: 'user-bob', role: 'editor' },
    { id: 'wm-3', workspaceId: 'ws-acme', userId: 'user-charlie', role: 'viewer' },
    { id: 'wm-4', workspaceId: 'ws-acme', userId: 'user-diana', role: 'admin' },
    // Startup Inc: Bob=owner, Alice=viewer
    { id: 'wm-5', workspaceId: 'ws-startup', userId: 'user-bob', role: 'owner' },
    { id: 'wm-6', workspaceId: 'ws-startup', userId: 'user-alice', role: 'viewer' },
  ])

  console.log('Seeding documents...')
  await db.insert(documents).values([
    {
      id: 'doc-1',
      title: 'Welcome to Acme',
      workspaceId: 'ws-acme',
      ownerId: 'user-alice',
      isPublic: true,
    },
    {
      id: 'doc-2',
      title: 'Project Roadmap',
      workspaceId: 'ws-acme',
      ownerId: 'user-alice',
      isPublic: false,
    },
    {
      id: 'doc-3',
      title: 'Meeting Notes',
      workspaceId: 'ws-acme',
      ownerId: 'user-bob',
      isPublic: false,
    },
    {
      id: 'doc-4',
      title: 'Startup Business Plan',
      workspaceId: 'ws-startup',
      ownerId: 'user-bob',
      isPublic: false,
    },
  ])

  console.log('Seeding IAM roles...')
  for (const role of allRoles) {
    await db.insert(accessRoles).values({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      inherits: role.inherits ?? [],
      scope: role.scope,
      metadata: role.metadata ?? null,
    })
  }

  console.log('Seeding IAM policies...')
  for (const policy of allPolicies) {
    await db.insert(accessPolicies).values({
      id: policy.id,
      name: policy.name,
      description: policy.description,
      version: policy.version,
      algorithm: policy.algorithm,
      rules: policy.rules,
      targets: policy.targets ?? null,
    })
  }

  console.log('Seeding IAM role assignments...')
  await db.insert(accessAssignments).values([
    // Acme Corp scoped assignments
    { subjectId: 'user-alice', roleId: 'owner', scope: 'ws-acme' },
    { subjectId: 'user-bob', roleId: 'editor', scope: 'ws-acme' },
    { subjectId: 'user-charlie', roleId: 'viewer', scope: 'ws-acme' },
    { subjectId: 'user-diana', roleId: 'admin', scope: 'ws-acme' },
    // Startup Inc scoped assignments
    { subjectId: 'user-bob', roleId: 'owner', scope: 'ws-startup' },
    { subjectId: 'user-alice', roleId: 'viewer', scope: 'ws-startup' },
  ])

  console.log('Seeding subject attributes...')
  await db.insert(accessSubjectAttrs).values(
    demoUsers.map((u) => ({
      subjectId: u.id,
      data: { name: u.name, email: u.email },
    })),
  )

  console.log('')
  console.log('Database seeded successfully!')
  console.log('')
  console.log('Demo accounts (password: password123):')
  console.log('  alice@example.com   — owner@acme, viewer@startup')
  console.log('  bob@example.com     — editor@acme, owner@startup')
  console.log('  charlie@example.com — viewer@acme')
  console.log('  diana@example.com   — admin@acme')

  await client.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
