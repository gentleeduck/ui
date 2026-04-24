---
name: duck-iam
description: >-
  Activate when working with @gentleduck/iam for RBAC/ABAC authorization,
  defining roles and policies, creating access control middleware for
  Express/Hono/Next.js, building permission checks in React, or configuring
  the duck-iam engine with adapters. Covers role builders, policy builders,
  rule builders, condition builders, server guards, and client-side
  permission components.
allowed-tools: Read Grep Glob Bash Edit Write
---

# @gentleduck/iam

Modern ABAC/RBAC access control engine. Framework-agnostic core with integrations for Express, Hono, Next.js, NestJS, React, and Vue.

## Package Exports

```
@gentleduck/iam              # Main entry (re-exports core)
@gentleduck/iam/core         # Core engine, builders, evaluate, explain
@gentleduck/iam/adapters/memory   # In-memory adapter (testing/prototyping)
@gentleduck/iam/adapters/prisma   # Prisma ORM adapter
@gentleduck/iam/adapters/drizzle  # Drizzle ORM adapter
@gentleduck/iam/adapters/http     # HTTP adapter (remote engine)
@gentleduck/iam/server/express    # Express middleware + guards
@gentleduck/iam/server/hono       # Hono middleware + guards
@gentleduck/iam/server/next       # Next.js App Router integration
@gentleduck/iam/server/nest       # NestJS decorators + module
@gentleduck/iam/server/generic    # Framework-agnostic server helpers
@gentleduck/iam/client/react      # React provider, hooks, components
@gentleduck/iam/client/vue        # Vue composables
@gentleduck/iam/client/vanilla    # Vanilla JS permission checker
```

## Quick Setup

### 1. Define Your Access Schema

Use `createAccessConfig` with `as const` arrays for full type safety. Every builder method constrains actions, resources, roles, and scopes at compile time.

```ts
import { createAccessConfig } from '@gentleduck/iam'

const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete', 'publish'] as const,
  resources: ['post', 'comment', 'user'] as const,
  roles: ['viewer', 'editor', 'admin'] as const,
  scopes: ['org-acme', 'org-globex'] as const,
  context: {} as unknown as AppContext, // phantom field for typed dot-paths
})
```

### 2. Define Roles (RBAC)

```ts
const viewer = access.defineRole('viewer')
  .name('Viewer')
  .desc('Read-only access')
  .grantRead('post', 'comment')
  .build()

const editor = access.defineRole('editor')
  .name('Editor')
  .inherits('viewer')
  .grant('create', 'post')
  .grant('update', 'post')
  .grantCRUD('comment')
  .grantWhen('delete', 'post', w => w.isOwner())
  .build()

const admin = access.defineRole('admin')
  .name('Administrator')
  .grantAll('*')
  .build()
```

**Role builder API:**
- `.name(n)` / `.desc(d)` -- display name and description
- `.inherits(...roleIds)` -- inherit permissions from parent roles (recursive, cycle-safe)
- `.scope(s)` -- restrict all permissions to a scope
- `.grant(action, resource, scope?)` -- single permission
- `.grantScoped(scope, action, resource)` -- single scoped permission
- `.grantWhen(action, resource, fn)` -- conditional permission
- `.grantAll(resource)` -- all actions on a resource (`'*'` for everything)
- `.grantRead(...resources)` -- read access on multiple resources
- `.grantCRUD(resource)` -- create/read/update/delete
- `.meta(attrs)` -- arbitrary metadata
- `.build()` -- returns plain `Role` object

### 3. Define Policies (ABAC)

```ts
const weekendDeny = access.policy('deny-weekends')
  .name('Deny on Weekends')
  .algorithm('deny-overrides')
  .rule('r-deny-weekends', r => r
    .deny()
    .on('create', 'update', 'delete')
    .of('*')
    .when(w => w.env('dayOfWeek', 'in', [0, 6]))
  )
  .build()

const ownerPolicy = access.policy('owner-access')
  .algorithm('allow-overrides')
  .rule('owner-update', r => r
    .allow()
    .on('update')
    .of('post')
    .when(w => w.isOwner())
  )
  .rule('owner-delete', r => r
    .allow()
    .on('delete')
    .of('post')
    .when(w => w.isOwner())
  )
  .build()
```

**Combining algorithms:**
- `deny-overrides` -- any deny wins (default, best for restrictions)
- `allow-overrides` -- any allow wins (best for RBAC / permissive rules)
- `first-match` -- first matching rule wins (firewall-style)
- `highest-priority` -- highest priority number wins

**Policy builder API:**
- `.name(n)` / `.desc(d)` / `.version(v)` -- metadata
- `.algorithm(a)` -- combining algorithm
- `.target({ actions?, resources?, roles? })` -- skip policy if request does not match targets
- `.rule(id, fn)` -- inline rule via callback
- `.addRule(rule)` -- add pre-built rule
- `.build()` -- returns plain `Policy` object

### 4. Define Rules

```ts
const rule = access.defineRule('post.update.owner')
  .allow()
  .desc('Authors may update their own posts')
  .priority(20)
  .on('update')
  .of('post')
  .when(w => w.isOwner())
  .build()
```

**Rule builder API:**
- `.allow()` / `.deny()` -- set effect (default: allow)
- `.desc(d)` -- description
- `.priority(p)` -- higher = evaluated first (default: 10)
- `.on(...actions)` -- actions this rule applies to (`'*'` for all)
- `.of(...resources)` -- resources this rule applies to (`'*'` for all)
- `.forScope(...scopes)` -- restrict to scopes
- `.when(fn)` -- ALL-of conditions (AND)
- `.whenAny(fn)` -- ANY-of conditions (OR)
- `.meta(attrs)` -- arbitrary metadata
- `.build()` -- returns plain `Rule` object

### 5. Condition Builder (`When`)

The `When` builder is used inside `.when()`, `.whenAny()`, and `.grantWhen()` callbacks.

**Typed dot-path checks:**
- `.check(field, op, value)` -- raw condition with typed field paths
- `.eq(field, value)` / `.neq(field, value)`
- `.gt(field, value)` / `.gte(field, value)` / `.lt(field, value)` / `.lte(field, value)`
- `.in(field, values)` / `.contains(field, value)` / `.exists(field)` / `.matches(field, regex)`

**Semantic shortcuts:**
- `.attr(path, op, value)` -- subject attribute (`subject.attributes.{path}`)
- `.resourceAttr(path, op, value)` -- resource attribute (`resource.attributes.{path}`)
- `.env(path, op, value)` -- environment attribute (`environment.{path}`)
- `.role(roleId)` -- subject has role
- `.roles(...ids)` -- subject has one of these roles
- `.scope(id)` / `.scopes(...ids)` -- request is in scope
- `.isOwner(ownerField?)` -- `resource.attributes.ownerId eq $subject.id`
- `.resourceType(...types)` -- resource type check

**Nesting (boolean logic):**
- `.and(fn)` -- nested ALL-of group
- `.or(fn)` -- nested ANY-of group (at least one must hold)
- `.not(fn)` -- nested NONE-of group (none may hold)

**Example -- complex condition:**
```ts
.when(w => w
  .or(o => o.isOwner().role('admin'))
  .env('hour', 'gte', 9)
  .env('hour', 'lte', 17)
  .not(n => n.attr('status', 'eq', 'banned'))
)
```

### 6. Create the Engine

```ts
import { MemoryAdapter } from '@gentleduck/iam/adapters/memory'

const adapter = new MemoryAdapter({
  policies: [weekendDeny, ownerPolicy],
  roles: [viewer, editor, admin],
  assignments: { 'user-1': ['editor'], 'user-2': ['viewer'] },
  attributes: { 'user-1': { department: 'engineering' } },
})

const engine = access.createEngine({
  adapter,
  defaultEffect: 'deny',     // deny when no rule matches (default)
  cacheTTL: 60,               // seconds (default: 60)
  maxCacheSize: 1000,         // LRU cache entries (default: 1000)
  hooks: {
    beforeEvaluate: async (req) => req,
    afterEvaluate: async (req, decision) => { /* audit log */ },
    onDeny: async (req, decision) => { /* alert */ },
    onError: async (err, req) => { /* report */ },
  },
})
```

**Engine API** (all async except invalidation):
- `engine.can(subjectId, action, resource, environment?, scope?)` -- returns `boolean`. `resource` is a `Resource` object: `{ type: string, id?: string, attributes: Record<string, unknown> }`.
- `engine.check(subjectId, action, resource, environment?, scope?)` -- returns `Decision` (includes `allowed`, `effect`, `reason`, `duration`, `timestamp`)
- `engine.authorize(request)` -- full `AccessRequest` evaluation
- `engine.explain(subjectId, action, resource, environment?, scope?)` -- returns `ExplainResult` trace (debug only, has overhead)
- `engine.permissions(subjectId, checks, environment?)` -- batch check, returns `PermissionMap` keyed by `"action:resource"` or `"scope:action:resource"`
- `engine.admin` -- CRUD interface for policies, roles, subjects (lazy-created)
- `engine.invalidate()` / `engine.invalidateSubject(id)` / `engine.invalidatePolicies()` / `engine.invalidateRoles()`

### 7. Server Integrations

#### Express

```ts
import { accessMiddleware, guard, adminRouter } from '@gentleduck/iam/server/express'

// Global middleware
app.use(accessMiddleware(engine, { getUserId: req => req.user?.id }))

// Per-route guard
app.delete('/posts/:id', guard(engine, 'delete', 'post'), handler)

// Admin API
app.use('/api/access-admin', adminRouter(engine)(() => express.Router()))
```

#### Hono

```ts
import { accessMiddleware, guard } from '@gentleduck/iam/server/hono'

app.use('*', accessMiddleware(engine, { getUserId: c => c.get('userId') as string }))
app.delete('/posts/:id', guard(engine, 'delete', 'post'), handler)
```

#### Next.js App Router

```ts
import { withAccess, checkAccess, getPermissions, createNextMiddleware } from '@gentleduck/iam/server/next'

// Route handler wrapper
export const DELETE = withAccess(engine, 'delete', 'post', handler, {
  getUserId: req => req.headers.get('x-user-id'),
})

// Server component helper
const allowed = await checkAccess(engine, userId, 'read', 'post')

// Generate permission map for client hydration
const perms = await getPermissions(engine, userId, [
  { action: 'create', resource: 'post' },
  { action: 'delete', resource: 'post' },
])

// Edge middleware
const checkMiddleware = createNextMiddleware(engine, {
  rules: [{ pattern: '/api/posts', resource: 'post' }],
  getUserId: req => req.headers.get('x-user-id'),
})
```

### 8. React Client Integration

```tsx
import React from 'react'
import { createAccessControl } from '@gentleduck/iam/client/react'

// Create once at app init
export const { AccessProvider, useAccess, usePermissions, Can, Cannot } = createAccessControl(React)

// In layout (pass server-generated permissions)
<AccessProvider permissions={perms}>
  <App />
</AccessProvider>

// In components
const { can, cannot } = useAccess()
if (can('delete', 'post')) { /* show delete button */ }

// Declarative
<Can action="create" resource="post" fallback={<p>No access</p>}>
  <CreatePostButton />
</Can>
<Cannot action="delete" resource="post">
  <p>You cannot delete posts</p>
</Cannot>
```

**Also exported by `createAccessControl`:**
- `usePermissions(fetchFn, deps?)` -- hook to async-fetch permissions from a server endpoint; returns `{ permissions, can, loading, error }`
- `AccessContext` -- raw React context (rarely needed directly)

## Testing Authorization

Use `MemoryAdapter` for unit tests. Seed it with roles, policies, and assignments, then assert with `engine.can()` or `engine.check()`:

```ts
import { createAccessConfig } from '@gentleduck/iam'
import { MemoryAdapter } from '@gentleduck/iam/adapters/memory'
import { describe, expect, it } from 'vitest'

describe('authorization', () => {
  const access = createAccessConfig({
    actions: ['read', 'delete'] as const,
    resources: ['post'] as const,
    roles: ['viewer', 'admin'] as const,
  })

  const viewer = access.defineRole('viewer').grantRead('post').build()
  const admin = access.defineRole('admin').grantAll('*').build()

  const engine = access.createEngine({
    adapter: new MemoryAdapter({
      roles: [viewer, admin],
      assignments: { 'u1': ['viewer'], 'u2': ['admin'] },
    }),
  })

  it('viewer can read posts', async () => {
    expect(await engine.can('u1', 'read', { type: 'post', attributes: {} })).toBe(true)
  })

  it('viewer cannot delete posts', async () => {
    expect(await engine.can('u1', 'delete', { type: 'post', attributes: {} })).toBe(false)
  })

  it('admin can delete posts', async () => {
    expect(await engine.can('u2', 'delete', { type: 'post', attributes: {} })).toBe(true)
  })
})
```

Use `engine.explain()` to debug failing assertions -- it returns the full evaluation trace.

## Coding Conventions

- Use `createAccessConfig` for type-safe builders. Use standalone `defineRole`/`defineRule`/`policy`/`when` only for untyped or dynamic scenarios.
- Always call `.build()` to finalize builders -- they return plain data objects.
- Roles produce RBAC permissions; policies produce ABAC rules. The engine combines both.
- A deny from any policy is final when using `deny-overrides`.
- Adapters are async interfaces. Use `MemoryAdapter` for tests, implement `Adapter` for production.
- The engine caches roles, policies, subjects, and RBAC-to-policy conversions with configurable TTL.
- Use `engine.explain()` for debugging -- it returns a full trace of why a decision was made.
- Use `engine.permissions()` for batch checks -- it loads data once and evaluates many.
- Server integrations follow a consistent pattern: `accessMiddleware` for global checks, `guard` for per-route.

## Do Not

- Do NOT import from `dist/` paths -- use the package export paths listed above.
- Do NOT skip `.build()` -- builders are mutable; only the built object is safe to pass around.
- Do NOT use `allow-overrides` for restriction policies -- a deny rule will be ignored if any allow matches.
- Do NOT hardcode role checks in application code -- use the engine or permission maps instead.
- Do NOT mutate `Role`/`Policy`/`Rule` objects after building -- treat them as immutable.
- Do NOT call `engine.explain()` in production hot paths -- it is a debug tool with extra overhead.
- Do NOT forget to invalidate caches after CRUD operations on roles/policies/subjects.
