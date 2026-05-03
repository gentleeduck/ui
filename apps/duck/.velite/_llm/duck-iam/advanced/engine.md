## Overview

The `Engine` is the central evaluator in duck-iam. You create an engine with an adapter and
optional configuration, then call its methods to check permissions. The engine loads roles and
policies from the adapter, resolves the subject, runs the evaluation pipeline, and returns a
decision.

```typescript

const adapter = new MemoryAdapter({
  roles: [viewer, editor, admin],
  assignments: { 'user-1': ['editor'] },
})

const engine = new Engine({ adapter })
```

## EngineConfig

The `Engine` constructor accepts an `EngineConfig` object:

```typescript
interface EngineConfig {
  adapter: Adapter           // Required. Storage backend for policies, roles, and subjects.
  defaultEffect?: Effect     // What to return when no rules match. Default: 'deny'.
  cacheTTL?: number          // Cache time-to-live in seconds. Default: 60.
  maxCacheSize?: number      // Maximum entries in the subject cache. Default: 1000.
  hooks?: EngineHooks        // Lifecycle hooks for observing and modifying evaluations.
}
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `adapter` | `Adapter` | -- | The storage backend. Required. |
| `defaultEffect` | `'allow' \| 'deny'` | `'deny'` | Decision when no rules match. Use `'deny'` for defense-in-depth. |
| `cacheTTL` | `number` | `60` | How long cached data lives, in seconds. |
| `maxCacheSize` | `number` | `1000` | Maximum number of resolved subjects in the LRU cache. |
| `hooks` | `EngineHooks` | `{}` | Lifecycle hooks. See the [Hooks](#hooks) section. |

### Full configuration example

```typescript
const engine = new Engine({
  adapter,
  defaultEffect: 'deny',
  cacheTTL: 120,
  maxCacheSize: 5000,
  hooks: {
    beforeEvaluate: (request) => {
      // Enrich with server timestamp
      return {
        ...request,
        environment: { ...request.environment, timestamp: Date.now() },
      }
    },
    afterEvaluate: (request, decision) => {
      console.log(`[access] ${request.subject.id} ${request.action} ${request.resource.type} -> ${decision.effect}`)
    },
    onDeny: (request, decision) => {
      auditLog.write({
        event: 'access_denied',
        subject: request.subject.id,
        action: request.action,
        resource: request.resource.type,
        reason: decision.reason,
      })
    },
    onError: (error, request) => {
      errorTracker.capture(error, { subject: request.subject.id })
    },
  },
})
```

## Core Methods

### engine.can()

The simplest check. Returns `true` or `false`.

```typescript
const allowed = await engine.can(
  'user-1',                                  // subject ID
  'update',                                  // action
  { type: 'post', attributes: {} },          // resource
)

if (!allowed) {
  throw new Error('Forbidden')
}
```

**Signature:**

```typescript
engine.can(
  subjectId: string,
  action: string,
  resource: Resource,
  environment?: Environment,
  scope?: string,
) -> Promise

Note: `engine.explain()` only triggers `beforeEvaluate`. The `afterEvaluate`, `onDeny`, and `onError`
hooks are not called on the explain path. If `beforeEvaluate`, subject resolution, or policy loading
throws, the explain call rejects.

```typescript
interface EngineHooks {
  beforeEvaluate?(request: AccessRequest): AccessRequest | Promise

The engine maintains four LRU caches:

| Cache | Key | Stores | Purpose |
| --- | --- | --- | --- |
| Policy cache | `'all'` | All ABAC policies | Avoid re-fetching policies on every check |
| Role cache | `'all'` | All role definitions | Avoid re-fetching roles on every check |
| RBAC policy cache | `'rbac'` | The synthetic RBAC policy | Avoid recomputing role-to-policy conversion |
| Subject cache | subject ID | Resolved subjects | Avoid re-resolving the same user repeatedly |

### Invalidation methods

```typescript
// Clear everything
engine.invalidate()

// Clear a specific user's cached data (after role change, attribute update)
engine.invalidateSubject('user-1')

// Clear cached policies (after adding/removing/editing policies)
engine.invalidatePolicies()

// Clear cached roles and all subjects (subjects depend on roles)
engine.invalidateRoles()
```

### When to invalidate

The admin API methods automatically invalidate the relevant caches:

- `admin.savePolicy()` / `admin.deletePolicy()`: invalidates policies.
- `admin.saveRole()` / `admin.deleteRole()`: invalidates roles + subjects.
- `admin.assignRole()` / `admin.revokeRole()`: invalidates the specific subject.
- `admin.setAttributes()`: invalidates the specific subject.

You only need to call invalidation methods manually if you modify data outside the admin API
(e.g., direct database writes).

### Tuning the cache

For high-traffic applications:

```typescript
const engine = new Engine({
  adapter,
  cacheTTL: 300,       // 5 minutes -- suitable for policies/roles that change infrequently
  maxCacheSize: 10000, // 10k subjects in memory
})
```

For real-time permission changes:

```typescript
const engine = new Engine({
  adapter,
  cacheTTL: 5,         // 5 seconds -- near real-time
  maxCacheSize: 500,
})
```

## Admin API

The `engine.admin` property exposes CRUD operations for policies, roles, and subject
attributes. All mutations automatically invalidate the relevant caches.

### Policy management

```typescript
// List all policies
const policies = await engine.admin.listPolicies()

// Get a specific policy
const policy = await engine.admin.getPolicy('ip-restriction')

// Save (create or update) a policy
await engine.admin.savePolicy({
  id: 'office-hours',
  name: 'Office Hours Only',
  algorithm: 'deny-overrides',
  rules: [
    {
      id: 'deny-outside-hours',
      effect: 'deny',
      priority: 100,
      actions: ['*'],
      resources: ['*'],
      conditions: {
        any: [
          { field: 'environment.hour', operator: 'lt', value: 9 },
          { field: 'environment.hour', operator: 'gt', value: 17 },
        ],
      },
    },
    {
      id: 'allow-all',
      effect: 'allow',
      priority: 1,
      actions: ['*'],
      resources: ['*'],
      conditions: { all: [] },
    },
  ],
})

// Delete a policy
await engine.admin.deletePolicy('office-hours')
```

### Role management

```typescript
// List all roles
const roles = await engine.admin.listRoles()

// Get a specific role
const role = await engine.admin.getRole('editor')

// Save (create or update) a role
await engine.admin.saveRole({
  id: 'moderator',
  name: 'Moderator',
  permissions: [
    { action: 'read', resource: 'post' },
    { action: 'update', resource: 'post' },
    { action: 'delete', resource: 'comment' },
  ],
  inherits: ['viewer'],
})

// Delete a role
await engine.admin.deleteRole('moderator')
```

### Role assignments

```typescript
// Assign a role to a user
await engine.admin.assignRole('user-1', 'editor')

// Assign a scoped role (multi-tenant)
await engine.admin.assignRole('user-1', 'admin', 'org-1')

// Revoke a role
await engine.admin.revokeRole('user-1', 'editor')

// Revoke a scoped role
await engine.admin.revokeRole('user-1', 'admin', 'org-1')
```

### Subject attributes

```typescript
// Set attributes (MemoryAdapter merges with existing; other adapters may replace)
await engine.admin.setAttributes('user-1', {
  department: 'engineering',
  level: 'senior',
  region: 'us-east',
})

// Read attributes
const attrs = await engine.admin.getAttributes('user-1')
// { department: 'engineering', level: 'senior', region: 'us-east' }
```

The exact merge/replace behavior depends on the adapter implementation. The `MemoryAdapter`
shallow-merges new attributes into existing ones. The `PrismaAdapter` and `DrizzleAdapter`
also merge. If you need to remove an attribute, set it to `null`.

## Putting It All Together

Here is a complete example that sets up an engine with hooks, uses the admin API to manage
roles and policies, and runs permission checks:

```typescript

// Define roles
const viewer = defineRole('viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()

const editor = defineRole('editor')
  .inherits('viewer')
  .grant('create', 'post')
  .grant('update', 'post')
  .build()

// Create engine
const adapter = new MemoryAdapter({
  roles: [viewer, editor],
  assignments: { 'user-1': ['editor'] },
})

const engine = new Engine({
  adapter,
  defaultEffect: 'deny',
  cacheTTL: 60,
  hooks: {
    afterEvaluate: (req, decision) => {
      console.log(`${req.subject.id} -> ${req.action}:${req.resource.type} = ${decision.effect}`)
    },
  },
})

// Check permissions
await engine.can('user-1', 'read', { type: 'post', attributes: {} })
// -> true

// Add a new role at runtime
await engine.admin.saveRole({
  id: 'admin',
  name: 'Admin',
  permissions: [{ action: '*', resource: '*' }],
  inherits: ['editor'],
})

await engine.admin.assignRole('user-1', 'admin')

await engine.can('user-1', 'delete', { type: 'post', attributes: {} })
// -> true (admin has wildcard)
```

---

## Engine FAQ

  
    Why would I use engine.authorize() instead of engine.can() or engine.check()?
    
      Use <code className="rounded bg-muted px-2 py-1">authorize()</code> when you already have a fully built
      <code className="rounded bg-muted px-2 py-1">AccessRequest</code> or want total control over the request object.
      Use <code className="rounded bg-muted px-2 py-1">can()</code> for a boolean convenience API and
      <code className="rounded bg-muted px-2 py-1">check()</code> when you want the full decision metadata.
    
  

  
    How is engine.permissions() different from calling engine.can() in a loop?
    
      <code className="rounded bg-muted px-2 py-1">permissions()</code> resolves the subject and policies once, then
      evaluates each requested permission with its own scope and hooks. It is the right API for navigation menus,
      client hydration, and other batched UI checks.
    
  

  
    Why are policies and roles cached as single entries while subjects are cached per user?
    
      Policies and roles are loaded as whole collections, so one cached entry is enough for each. Subjects are resolved
      individually, so the engine keeps a separate cache entry per subject ID.
    
  

  
    Do engine.admin mutations clear caches automatically?
    
      Yes. The admin facade invalidates policy, role, and subject caches after writes. Direct writes through the adapter
      do not automatically clear caches, so call the invalidation methods yourself when you bypass
      <code className="rounded bg-muted px-2 py-1">engine.admin</code>.
    
  

  
    Can I change roles and policies at runtime without redeploying?
    
      Yes, if your adapter is backed by persistent storage. The engine reads roles and policies from the adapter, so a
      database-backed setup can evolve independently of application deployments.
    
  

  
    How should I split coarse-grained and fine-grained authorization?
    
      Use middleware and route wrappers for broad entry checks, then run record-level
      <code className="rounded bg-muted px-2 py-1">engine.can()</code> or <code className="rounded bg-muted px-2 py-1">engine.check()</code>
      inside handlers once you have the real resource ID and attributes.
    
  

  
    Can hook exceptions change the result of a permission check?
    
      Yes. In the current implementation, thrown hook errors feed into the engine's error path, which means even a
      logging or metrics hook can turn an otherwise successful check into a deny result. Keep hooks defensive and avoid
      throwing from them.
    
  

  
    When should I use buildPermissionKey() directly?
    
      Use it when you need to create or inspect `PermissionMap` keys outside the built-in helpers and clients. It keeps
      your custom code aligned with the same action/resource/resourceId/scope ordering used by the engine.
    
  

  
    When would I import LRUCache instead of relying on engine caching?
    
      Only when you want the same small TTL+LRU behavior in adjacent application code, such as caching derived auth
      metadata. The engine already manages its own internal caches; importing <code className="rounded bg-muted px-2 py-1">LRUCache</code>
      is not part of normal engine setup.