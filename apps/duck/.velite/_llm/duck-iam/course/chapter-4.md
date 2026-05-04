## Goal

The engine is more than `engine.can()`. This chapter covers every engine method, hooks for
enrichment and logging, caching, batch permission checks, the explain API, and the Admin API.

beforeEvaluateafterEvaluateonDeny, onError"]
        C["Caching4 LRU cachesTTL + size limits"]
        B["Batchpermissions()check many at once"]
        X["Explainfull evaluation tracedebug denials"]
        A["Admin APImanage at runtimeauto-invalidate"]
    end`} />

## Engine Methods Overview

| Method | Returns (dev) | Returns (prod) | Description |
| --- | --- | --- | --- |
| `engine.can(subjectId, action, resource, env?, scope?)` | `boolean` | `boolean` | Simple yes/no permission check |
| `engine.check(subjectId, action, resource, env?, scope?)` | `Decision` | `boolean` | Full decision in dev, fast boolean in prod |
| `engine.authorize(request)` | `Decision` | `Decision` | Low-level: takes a full `AccessRequest` |
| `engine.permissions(subjectId, checks, env?)` | `PermissionMap` | `Record(core engine logic)"]
        H3["3. afterEvaluate(always runs)"]
        H4["4. onDeny(only if denied)"]
    end

    subgraph Error["On Error"]
        direction TB
        E1["onError(if any step throws)"]
        E2["Result: deny(fail closed)"]
    end

    H1 --> H2 --> H3 --> H4
    H1 -.->|"throws"| E1 --> E2
    H2 -.->|"throws"| E1`} />

### Hook Type Signatures

```typescript
interface EngineHooks {
  // Runs before evaluation. Can modify the request (enrich with DB data).
  beforeEvaluate?(
    request: AccessRequest,
  ): AccessRequest | Promise(1 entry)"]
        RC["Role Cacheall role definitions(1 entry)"]
        RB["RBAC Policy Cachesynthetic __rbac__ policy(1 entry)"]
        SC["Subject Cacheper-user roles + attributes(up to maxCacheSize entries)"]
    end

    REQ["PermissionCheck"] --> SC
    SC --> |"miss"| ADAPTER["Adapter"]
    SC --> |"hit"| EVAL["Evaluate"]
    ADAPTER --> SC`} />

### How Caching Works

1. **Policy cache** (1 entry): stores the result of `adapter.listPolicies()`. All policies
   are loaded once and cached together.
2. **Role cache** (1 entry): stores the result of `adapter.listRoles()`. All roles are
   loaded once and cached together.
3. **RBAC policy cache** (1 entry): stores the `__rbac__` policy generated from roles.
   Regenerated only when the role cache is invalidated.
4. **Subject cache** (up to `maxCacheSize` entries): stores per-user data: resolved roles,
   scoped roles, and attributes. Uses LRU eviction when full.

All caches use TTL. Entries expire after `cacheTTL` seconds and are re-fetched from the
adapter on the next access.

### Configuration

```typescript
const engine = new Engine({
  adapter,
  cacheTTL: 60,         // seconds (default: 60, set to 0 to disable)
  maxCacheSize: 1000,   // max cached subjects (default: 1000)
})
```

- `cacheTTL: 0` disables caching entirely (useful for tests)
- The subject cache uses LRU eviction: least recently used entries are dropped first
- Policy and role caches are single-entry, storing all data in one cache slot

### Manual Invalidation

```typescript
engine.invalidate()                  // clear ALL caches
engine.invalidateSubject('user-1')   // clear one user's cached data
engine.invalidatePolicies()          // clear policy cache only
engine.invalidateRoles()             // clear role + RBAC + ALL subject caches
```

`invalidateRoles()` also clears the subject cache because subjects cache their resolved
roles. If role definitions change, all cached subject data becomes stale.

## Batch Permissions

For UIs checking 10-20 permissions at once, use `engine.permissions()`:

```typescript
const checks = [
  { action: 'create', resource: 'post' },
  { action: 'update', resource: 'post', resourceId: 'post-1' },
  { action: 'delete', resource: 'post', resourceId: 'post-1' },
  { action: 'manage', resource: 'dashboard' },
  { action: 'manage', resource: 'user', scope: 'acme' },
]

const perms = await engine.permissions('bob', checks)
// {
//   'create:post': true,
//   'update:post:post-1': true,
//   'delete:post:post-1': false,
//   'manage:dashboard': false,
//   'acme:manage:user': true,
// }
```

### PermissionCheck Type

```typescript
interface PermissionCheck {
  action: string       // the action to check
  resource: string     // the resource type
  resourceId?: string  // optional: specific resource instance
  scope?: string       // optional: scope for this check
}
```

### PermissionMap Key Format

| Format | Example | When |
| --- | --- | --- |
| `action:resource` | `'create:post'` | No resourceId, no scope |
| `action:resource:resourceId` | `'update:post:post-1'` | With resourceId |
| `scope:action:resource` | `'acme:manage:user'` | With scope |
| `scope:action:resource:resourceId` | `'acme:update:post:post-1'` | Both scope and resourceId |

### Performance

`permissions()` is faster than calling `can()` in a loop: subject data is loaded once,
policies are loaded once, and the adapter is queried once rather than N times.

Each check still goes through the full evaluation pipeline including hooks. If any check
throws, it defaults to `false` and `onError` is called.

### Environment in Batch

```typescript
const perms = await engine.permissions('bob', checks, {
  ip: '192.168.1.1',
  timestamp: Date.now(),
})
```

## Explain and Debug

When a permission check returns an unexpected result, use `engine.explain()`:

```typescript
const result = await engine.explain('bob', 'update', {
  type: 'post',
  id: 'post-2',
  attributes: { ownerId: 'alice' },
})

console.log(result.summary)
```

Output:

```text
DENIED: "bob" -> update on post
  Roles: [editor, viewer]
  __rbac__ [allow-overrides]: Allowed by rule "rbac.editor.update.post.0" (1/6 rules matched)
  owner-restrictions [deny-overrides]: Denied by rule "deny-non-owner-update" (1/1 rules matched)
  Result: Denied by rule "deny-non-owner-update"
```

### ExplainResult Structure

```typescript
interface ExplainResult {
  decision: Decision                // the final decision
  request: {
    action: string
    resourceType: string
    resourceId?: string
    scope?: string
  }
  subject: {
    id: string
    roles: string[]                 // base roles
    scopedRolesApplied: string[]    // additional scoped roles added
    attributes: Record<string, any>
  }
  policies: PolicyTrace[]           // trace for each policy
  summary: string                   // human-readable summary
}
```

### PolicyTrace and RuleTrace

```typescript
interface PolicyTrace {
  policyId: string
  policyName: string
  algorithm: CombiningAlgorithm
  targetMatch: boolean           // did the policy targets match?
  rules: RuleTrace[]             // trace for each rule
  result: Effect                 // this policy's result
  reason: string                 // why this policy decided this way
  decidingRuleId?: string        // which rule decided (if any)
}

interface RuleTrace {
  ruleId: string
  description?: string
  effect: Effect
  priority: number
  actionMatch: boolean           // did the action match?
  resourceMatch: boolean         // did the resource match?
  conditionsMet: boolean         // did all conditions pass?
  conditions: ConditionGroupTrace // detailed condition trace
  matched: boolean               // actionMatch AND resourceMatch AND conditionsMet
}
```

### ConditionTrace

```typescript
// Leaf condition trace
interface ConditionLeafTrace {
  type: 'condition'
  field: string           // e.g., 'resource.attributes.ownerId'
  operator: Operator      // e.g., 'neq'
  expected: any           // e.g., 'bob' (resolved from $subject.id)
  actual: any             // e.g., 'alice' (resolved from the resource)
  result: boolean         // true (alice neq bob = true)
}

// Group condition trace
interface ConditionGroupTrace {
  type: 'group'
  logic: 'all' | 'any' | 'none'
  result: boolean
  children: (ConditionLeafTrace | ConditionGroupTrace)[]
}
```

### Explain Does Not Short-Circuit

Unlike normal evaluation, `explain()` evaluates all rules in all policies, even after a
deny is found. Normal `evaluate()` stops at the first denying policy for performance.

## Admin API

Manage authorization data at runtime through `engine.admin`:

```typescript
// Policies
await engine.admin.listPolicies()
await engine.admin.getPolicy('owner-restrictions')
await engine.admin.savePolicy(newPolicy)
await engine.admin.deletePolicy('old-policy-id')

// Roles
await engine.admin.listRoles()
await engine.admin.getRole('editor')
await engine.admin.saveRole(newRole)
await engine.admin.deleteRole('old-role-id')

// Subject management
await engine.admin.assignRole('user-1', 'editor')
await engine.admin.assignRole('user-1', 'admin', 'acme')  // scoped
await engine.admin.revokeRole('user-1', 'editor')
await engine.admin.revokeRole('user-1', 'admin', 'acme')  // scoped

// Subject attributes
await engine.admin.setAttributes('user-1', { department: 'engineering' })
const attrs = await engine.admin.getAttributes('user-1')
```

### Complete Admin API

| Method | Description | Cache Invalidation |
| --- | --- | --- |
| `listPolicies()` | List all policies | none |
| `getPolicy(id)` | Get a single policy | none |
| `savePolicy(policy)` | Create or update a policy | clears policy cache |
| `deletePolicy(id)` | Delete a policy | clears policy cache |
| `listRoles()` | List all roles | none |
| `getRole(id)` | Get a single role | none |
| `saveRole(role)` | Create or update a role | clears role + RBAC + subject caches |
| `deleteRole(id)` | Delete a role | clears role + RBAC + subject caches |
| `assignRole(subjectId, roleId, scope?)` | Assign a role to a subject | clears that subject's cache |
| `revokeRole(subjectId, roleId, scope?)` | Revoke a role from a subject | clears that subject's cache |
| `setAttributes(subjectId, attrs)` | Set subject attributes | clears that subject's cache |
| `getAttributes(subjectId)` | Get subject attributes | none |

Every mutation automatically invalidates the relevant cache. When you call
`admin.assignRole('user-1', 'editor')`, the user-1 subject cache is cleared so the next
check picks up the new role. No manual invalidation needed after admin operations.

## Checkpoint: Complete Engine Setup

  
    Full engine with all features
    

```typescript

validateRoles([viewer, editor, admin])

const adapter = new MemoryAdapter({
  roles: [viewer, editor, admin],
  assignments: { alice: ['viewer'], bob: ['editor'], charlie: ['admin'] },
  policies: [ownerPolicy],
})

export const engine = new Engine({
  adapter,
  defaultEffect: 'deny',
  cacheTTL: 60,
  maxCacheSize: 1000,
  hooks: {
    beforeEvaluate: async (request) => {
      // Enrich with DB data
      if (request.resource.type === 'post' && request.resource.id) {
        const post = await db.posts.findUnique({ where: { id: request.resource.id } })
        return {
          ...request,
          resource: {
            ...request.resource,
            attributes: { ...request.resource.attributes, ownerId: post?.authorId },
          },
        }
      }
      return request
    },
    afterEvaluate: async (request, decision) => {
      console.log(`[audit] ${request.subject.id} ${decision.effect} ${request.action}:${request.resource.type}`)
    },
    onDeny: async (request, decision) => {
      console.log(`[denied] ${request.subject.id} -> ${request.action}:${request.resource.type}: ${decision.reason}`)
    },
    onError: async (error) => {
      console.error('[auth-error]', error)
    },
  },
})
```

    
  

---

## Chapter 4 FAQ

  
    In what order do hooks run?
    
      `beforeEvaluate` runs first, `afterEvaluate` runs after the decision is made, `onDeny`
      runs only if denied (after `afterEvaluate`), and `onError` runs if any error occurs.
      If `beforeEvaluate` throws, evaluation is skipped and the result is deny. All hooks are
      async-safe.
    
  

  
    What if the cache serves stale data?
    
      The cache has a TTL (default 60 seconds). After that, the next check refreshes from the
      adapter. For immediate consistency after a change, use the Admin API (which auto-invalidates)
      or call `engine.invalidateSubject(id)` manually. For tests, set `cacheTTL: 0`.
    
  

  
    Can I use explain() in production?
    
      `explain()` is only available in development mode. To use it in a deployed environment,
      create a separate development-mode engine for a debug endpoint or admin tool. Note that
      `explain()` does not trigger side-effect hooks (`afterEvaluate`, `onDeny`, `onError`),
      but it still runs `beforeEvaluate` and evaluates all rules without short-circuiting, so
      it is more expensive than `can()`.
    
  

  
    Should the Admin API be exposed to users?
    
      No. Protect it with its own authorization check (e.g., only users with the `admin` role
      can call admin endpoints). Never expose `savePolicy()` or `assignRole()` to untrusted
      users without validation.
    
  

  
    Can engine.permissions() use scopes?
    
      Yes. Each check in the array can include an optional `scope` field:
      `{ action: 'manage', resource: 'user', scope: 'acme' }`. The key in the returned map
      includes the scope: `'acme:manage:user': true`. You can mix scoped and unscoped checks
      in the same batch.
    
  

  
    When should I use authorize() instead of can()?
    
      Use `authorize()` when you already have a resolved `Subject` object and want to skip
      the adapter lookup. Useful in middleware where you resolve the user once and check
      multiple permissions, or in tests where you construct subjects manually.
    
  

  
    Should I ever change defaultEffect from 'deny'?
    
      Almost never. `'deny'` means unmatched requests are denied (fail-closed). Changing to
      `'allow'` means any request that doesn't match a rule is permitted, a significant
      security risk. The only valid use case is development environments where you want to
      log denials without blocking requests.
    
  

  
    Why does invalidateRoles() also clear the subject cache?
    
      Subjects cache their resolved roles (including inherited ones). If you change a role
      definition (e.g., add a permission to `editor`), all cached subjects with that role have
      stale data. `invalidateRoles()` clears the role cache, the RBAC policy cache, and all
      subject caches.
    
  

---

Next: [Chapter 5: Multi-Tenant Scoping](/duck-iam/course/chapter-5)