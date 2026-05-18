# BlogDuck

A full-stack example app showing how `@gentleduck/iam` handles authorization across a **NestJS API** and **Next.js frontend** with a shared **SQLite + Drizzle** database.

Three users - Alice (viewer), Bob (editor), Charlie (admin) - each see a different UI based on their permissions. The same access rules are enforced on both the server and the client, defined once in a single shared package.

## Quick Start

```bash
cd examples/blogduck
./run.sh
```

This builds `@gentleduck/iam`, seeds the database, starts the API on `:3001` and the frontend on `:3000`. Press `Ctrl+C` to stop everything and delete the database.

## Project Structure

```
blogduck/
|-- run.sh                          # One command to start everything
|-- packages/
|   |-- shared/                     # Access config, DB schema, seed script
|   |   +-- src/
|   |       |-- access.ts           # Roles, engine, permission checks
|   |       |-- db.ts               # Drizzle schema (SQLite)
|   |       |-- seed.ts             # Create tables + seed data
|   |       +-- index.ts            # Re-exports
|   |-- api/                        # NestJS backend
|   |   +-- src/
|   |       |-- main.ts             # Entry point
|   |       |-- app.module.ts       # Root module with global guard
|   |       |-- access/
|   |       |   |-- access.guard.ts # Wraps nestAccessGuard
|   |       |   |-- access.module.ts# Provides engine globally
|   |       |   +-- authorize.ts    # Typed @Authorize decorator
|   |       |-- posts/              # CRUD controller + service
|   |       +-- permissions/        # Serves permission map to frontend
|   +-- web/                        # Next.js frontend
|       +-- src/
|           |-- app/page.tsx        # Server component: fetches data + permissions
|           |-- lib/
|           |   |-- access-client.tsx# Creates AccessProvider, Can, Cannot, useAccess
|           |   +-- api.ts          # Fetch helper
|           +-- components/
|               |-- post-list.tsx   # Posts with permission-gated UI
|               +-- user-switcher.tsx# Switch between Alice/Bob/Charlie
```

## How It Works

### 1. Define your access rules once

Everything starts in `shared/src/access.ts`. You declare your actions and resources, then build roles with a type-safe builder:

```ts
const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete'] as const,
  resources: ['post', 'user'] as const,
})

const viewer = access
  .defineRole('viewer')
  .name('Viewer')
  .grant('read', 'post')
  .build()

const editor = access
  .defineRole('editor')
  .name('Editor')
  .inherits('viewer')          // gets all viewer permissions
  .grant('create', 'post')
  .grant('update', 'post')
  .build()

const admin = access
  .defineRole('admin')
  .name('Admin')
  .inherits('editor')          // gets all editor + viewer permissions
  .grant('delete', 'post')
  .grant('create', 'user')
  .grant('read', 'user')
  .grant('update', 'user')
  .grant('delete', 'user')
  .build()
```

The `as const` on the config input is what makes everything type-safe. If you write `.grant('deletee', 'post')`, TypeScript catches the typo at compile time. The same goes for `@Authorize({ action: 'deletee', resource: 'post' })` in your controllers and `<Can action="deletee" resource="post">` in your components.

### 2. Store roles in your database

The `DrizzleAdapter` reads and writes roles, policies, and assignments from your database. You define the tables alongside your app's tables:

```ts
// duck-iam tables - live next to your app tables
const accessRoles        = sqliteTable('access_roles', { ... })
const accessPolicies     = sqliteTable('access_policies', { ... })
const accessAssignments  = sqliteTable('access_assignments', { ... })
const accessSubjectAttrs = sqliteTable('access_subject_attrs', { ... })

const adapter = new DrizzleAdapter({
  db,
  tables: { policies: accessPolicies, roles: accessRoles, assignments: accessAssignments, attrs: accessSubjectAttrs },
  ops: { eq, and },
})
```

The seed script inserts roles and assigns them to users. In production, you'd do this through an admin UI or migration.

### 3. Protect API routes with a decorator

The NestJS integration gives you `@Authorize` - a typed decorator that checks permissions before the handler runs:

```ts
@Post()
@Authorize({ action: 'create', resource: 'post' })
create(@Req() req: Request, @Body() body: { title: string; body: string }) {
  // Only reached if the user has 'create' permission on 'post'
  return this.posts.create(userId, body)
}
```

Behind the scenes, a global `AccessGuard` extracts the user ID from the `x-user-id` header, looks up their roles in the database, resolves inherited permissions, and evaluates the request. You write one guard, register it once, and every `@Authorize` decorator just works.

Routes without `@Authorize` are public - the guard sees no metadata and lets them through.

### 4. Gate UI elements on the frontend

The server component fetches a **permission map** - a flat `{ "create:post": true, "delete:post": false, ... }` object - and passes it to the client through `AccessProvider`:

```tsx
// Server component (page.tsx)
const permissions = await apiFetch('/permissions', userId)

return (
  <AccessProvider permissions={permissions}>
    <PostList posts={posts} userId={userId} />
  </AccessProvider>
)
```

Client components use `<Can>`, `<Cannot>`, and `useAccess()` to show or hide UI:

```tsx
// Show the create form only to users who can create posts
<Can action="create" resource="post">
  <CreatePostForm />
</Can>

// Show a message to users who can't
<Cannot action="create" resource="post">
  <p>You don't have permission to create posts.</p>
</Cannot>

// Programmatic check
const { can } = useAccess()
if (can('delete', 'post')) { ... }
```

### 5. Permissions are enforced on both sides

This is the key architectural point. The frontend gates are cosmetic - they hide buttons and forms. The real enforcement happens on the API. If someone bypasses the UI and sends a `DELETE /posts/1` request, the guard blocks it.

Both sides use the same role definitions from `@blogduck/shared`, so they can never disagree about what a viewer or admin can do.

## The Data Flow

```
                   +-------------------------------------+
                   |           @blogduck/shared           |
                   |                                     |
                   |  access.ts   roles, engine, CHECKS  |
                   |  db.ts       drizzle schema + conn  |
                   |  seed.ts     create tables + data   |
                   +----------+----------+---------------+
                              |          |
                    +---------v--+  +----v-------------+
                    |  API        |  |  Frontend         |
                    |  (NestJS)   |  |  (Next.js)        |
                    |             |  |                   |
                    |  Guard      |  |  GET /permissions |
                    |  checks     |<--|  on each page     |
                    |  engine.can |  |  load             |
                    |  per route  |  |                   |
                    |             |  |  AccessProvider   |
                    |  POST/PUT/  |  |  wraps the page   |
                    |  DELETE     |  |                   |
                    |  blocked if |  |  <Can>/<Cannot>   |
                    |  no perm    |  |  gate UI elements |
                    +-------------+  +-------------------+
```

1. **Page load**: the Next.js server component calls `GET /permissions` with the user's ID, gets back a permission map
2. **Render**: `AccessProvider` makes the map available to all client components. `<Can>` and `<Cannot>` conditionally render based on permissions
3. **User action**: when a user clicks "Create Post", the frontend sends `POST /posts` with the `x-user-id` header
4. **Guard**: `AccessGuard` intercepts the request, calls `engine.can(userId, 'create', { type: 'post' })`, and either allows or rejects it
5. **Response**: if allowed, the controller runs and returns the new post. If denied, NestJS returns 403

## What `@gentleduck/iam` Gives You

### Type safety from config to UI

The `as const` config propagates literal types everywhere. Your actions are `'create' | 'read' | 'update' | 'delete'`, not `string`. Your resources are `'post' | 'user'`, not `string`. This means:

- `@Authorize({ action: 'publish', resource: 'post' })` - compile error, `'publish'` is not a valid action
- `<Can action="read" resource="comment">` - compile error, `'comment'` is not a valid resource
- `engine.can(userId, 'deletee', { type: 'post' })` - compile error, typo caught

You can't ship a permission check that references something that doesn't exist.

### Role inheritance

`editor` inherits from `viewer`. `admin` inherits from `editor`. You don't repeat permissions - you build a hierarchy. When the engine evaluates `admin`, it resolves the full chain: admin's own grants + editor's grants + viewer's grants.

### Database-backed roles (not hardcoded)

Roles, policies, and assignments live in your database, not in code. The `DrizzleAdapter` reads them at runtime. This means:

- You can add new roles without redeploying
- You can assign and revoke roles through an admin API (`engine.admin.assignRole()`, `engine.admin.revokeRole()`)
- You can change what a role can do at runtime (`engine.admin.saveRole()`)

The seed script inserts roles from code, but that's just for bootstrapping. In production, roles evolve independently of deploys.

### Scoped roles

Not shown in this example, but the engine supports scoped roles. A user can be an `editor` in `org-1` and a `viewer` in `org-2`:

```ts
engine.admin.assignRole('alice', 'editor', 'org-1')
engine.admin.assignRole('alice', 'viewer', 'org-2')

await engine.can('alice', 'create', { type: 'post' }, undefined, 'org-1')  // true
await engine.can('alice', 'create', { type: 'post' }, undefined, 'org-2')  // false
```

### ABAC policies (beyond RBAC)

The engine also supports attribute-based policies with conditions - time-of-day restrictions, IP allowlists, resource ownership checks. You can combine RBAC and ABAC in the same engine. This example only uses RBAC for simplicity.

### Framework integrations that compose

Each integration is a thin layer:

| Layer | What it does | Import |
|-------|-------------|--------|
| `nestAccessGuard` | Creates a NestJS-compatible guard function | `@gentleduck/iam/server/nest` |
| `createTypedAuthorize` | Type-safe `@Authorize` decorator factory | `@gentleduck/iam/server/nest` |
| `createEngineProvider` | NestJS DI provider for the engine | `@gentleduck/iam/server/nest` |
| `generatePermissionMap` | Batch-evaluates permissions for a user | `@gentleduck/iam/server/generic` |
| `createAccessControl` | React context + `Can`/`Cannot` components | `@gentleduck/iam/client/react` |

None of these are magic. `nestAccessGuard` is ~30 lines. `createAccessControl` is a React context with a `can()` function. You can read the source and understand exactly what happens.

### Caching built in

The engine caches role lookups and policy evaluations with an LRU cache (configurable TTL). In this example it's 30 seconds. In production, you'd tune this based on how often roles change.

```ts
const engine = access.createEngine({
  adapter,
  cacheTTL: 30,  // seconds
})

// Manually bust cache when you change roles
engine.invalidate()
engine.invalidateSubject('alice')
```

## Users and Permissions

| User | Role | create:post | read:post | update:post | delete:post | read:user | delete:user |
|------|------|:-----------:|:---------:|:-----------:|:-----------:|:---------:|:-----------:|
| Alice | viewer | | x | | | | |
| Bob | editor | x | x | x | | | |
| Charlie | admin | x | x | x | x | x | x |

Switch between users in the frontend to see the UI change. Alice sees a read-only list. Bob sees a create form. Charlie sees create + delete buttons on every post.
