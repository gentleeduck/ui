## Goal

By the end of this chapter, Alice can read blog posts but not delete them.

(viewer role)"] --> E["Engine"]
    E --> |"can read post?"| YES["ALLOWED"]
    E --> |"can delete post?"| NO["DENIED"]`} />

## Step by Step

  
    **Install duck-iam**

    ```bash
    npm install @gentleduck/iam
    ```

    Zero runtime dependencies. Works with npm, yarn, pnpm, and bun.
  

  
    **Define a role**

    Create `src/access.ts`:

    ```typescript title="src/access.ts"
    import { defineRole } from '@gentleduck/iam'

    // A viewer can read posts and comments
    export const viewer = defineRole('viewer')
      .grant('read', 'post')
      .grant('read', 'comment')
      .build()
    ```

    `defineRole()` returns a builder. Chain `.grant(action, resource)` to add permissions.
    `.build()` returns a plain `Role` object — serializable, no methods, no hidden state.
  

  
    **Create an adapter and engine**

    The engine needs an **adapter** to load data (roles, policies, assignments).
    `MemoryAdapter` stores everything in memory:

    ```typescript title="src/access.ts"
    import { defineRole, Engine } from '@gentleduck/iam'
    import { MemoryAdapter } from '@gentleduck/iam/adapters/memory'

    export const viewer = defineRole('viewer')
      .grant('read', 'post')
      .grant('read', 'comment')
      .build()

    const adapter = new MemoryAdapter({
      roles: [viewer],
      assignments: {
        'alice': ['viewer'],
      },
    })

    export const engine = new Engine({ adapter }) // defaults to mode: 'development'
    ```

    `assignments` maps subject IDs to role IDs. A subject can have several roles:
    `'alice': ['viewer', 'commenter']`.
  

  
    **Run your first permission check**

    Create `src/main.ts`:

    ```typescript title="src/main.ts"
    import { engine } from './access'

    async function main() {
      // Can Alice read a post?
      const canRead = await engine.can('alice', 'read', {
        type: 'post',
        attributes: {},
      })
      console.log('Alice can read post:', canRead)
      // Alice can read post: true

      // Can Alice delete a post?
      const canDelete = await engine.can('alice', 'delete', {
        type: 'post',
        attributes: {},
      })
      console.log('Alice can delete post:', canDelete)
      // Alice can delete post: false
    }

    main()
    ```

    Run it:

    ```bash
    npx tsx src/main.ts
    ```
  

## engine.can() vs engine.check()

| Method | Returns | Use when |
| --- | --- | --- |
| `engine.can()` | `boolean` (always) | Yes/no is enough |
| `engine.check()` | `Decision` in dev, `boolean` in prod | You need reason, timing, deciding rule |

```typescript
// Simple boolean -- most common
const allowed = await engine.can('alice', 'read', { type: 'post', attributes: {} })
// true

// Full decision object (in development mode -- returns boolean in production mode)
const decision = await engine.check('alice', 'read', { type: 'post', attributes: {} })
// { allowed: true, effect: 'allow', reason: '...', duration: 0.12, ... }
```

Both methods share the same signature:

```typescript
engine.can(subjectId, action, resource, environment?, scope?)
engine.check(subjectId, action, resource, environment?, scope?)
```

`environment` and `scope` are optional and covered later.

## What Just Happened

grant read on post"]
        A["Assignment:alice -> viewer"]
    end

    subgraph Engine["Engine Evaluation"]
        direction TB
        E1["1. resolveSubject()Load alice's roles from adapter"]
        E2["2. rolesToPolicy()Convert roles to __rbac__ policy"]
        E3["3. evaluate()Does any rule matchread + post?"]
        E4["4. Rule matches!Effect: allow"]
    end

    subgraph Output["Result"]
        D["Decision:allowed = true"]
    end

    Input --> Engine --> Output`} />

When you call `engine.can('alice', 'read', { type: 'post', attributes: {} })`:

1. **resolveSubject**: loads Alice's roles from the adapter — `['viewer']`. Also
   resolves inheritance (Chapter 2) and loads her attributes.
2. **rolesToPolicy**: converts her roles into a synthetic policy `__rbac__` with the
   `allow-overrides` algorithm. Each permission becomes a rule.
3. **evaluate**: runs all policies (`__rbac__` plus custom policies from Chapter 3),
   checking whether `read` on `post` matches any rule.
4. **Decision**: the `read:post` rule matches. Effect: allow.

For `delete`, no rule matches, so the engine returns the default effect: deny.

### The __rbac__ Synthetic Policy

Role definitions don't run directly. The engine converts them into a standard ABAC
policy:

```typescript
// Your role:
defineRole('viewer').grant('read', 'post').build()

// Becomes this policy internally:
{
  id: '__rbac__',
  name: 'RBAC Policies',
  algorithm: 'allow-overrides',
  rules: [{
    id: 'rbac.viewer.read.post.0',
    effect: 'allow',
    actions: ['read'],
    resources: ['post'],
    conditions: { all: [
      { field: 'subject.roles', operator: 'contains', value: 'viewer' }
    ]},
  }],
}
```

RBAC and ABAC share one evaluation pipeline. Roles are shorthand for policies.

## The Decision Object

`engine.check()` returns a `Decision`:

```typescript
interface Decision {
  allowed: boolean        // true or false
  effect: 'allow' | 'deny'  // same as allowed, as a string
  rule?: Rule             // the rule that decided (if any)
  policy?: string         // the policy ID that decided
  reason: string          // human-readable explanation
  duration: number        // how long evaluation took (ms)
  timestamp: number       // when the decision was made (Date.now())
}
```

```typescript
const decision = await engine.check('alice', 'read', { type: 'post', attributes: {} })

console.log(decision.allowed)    // true
console.log(decision.effect)     // 'allow'
console.log(decision.reason)     // 'Allowed by rule "rbac.viewer.read.post.0"'
console.log(decision.policy)     // '__rbac__'
console.log(decision.duration)   // 0.12 (milliseconds)
console.log(decision.timestamp)  // 1708300000000
```

Use `decision.duration` for performance monitoring, `decision.reason` for debugging,
and `decision.policy` / `decision.rule` to trace the deciding rule.

## The Resource Object

```typescript
interface Resource {
  type: string           // the resource type (matches rule resources)
  id?: string            // optional: specific resource instance
  attributes: Attributes // resource metadata for conditions
}
```

```typescript
// Minimal resource (just the type)
{ type: 'post', attributes: {} }

// With a specific instance ID
{ type: 'post', id: 'post-123', attributes: {} }

// With metadata for conditions (Chapter 3)
{
  type: 'post',
  id: 'post-123',
  attributes: {
    ownerId: 'alice',
    status: 'published',
    tags: ['featured', 'tech'],
  },
}
```

`type` matches against role permissions. `id` identifies a specific instance.
`attributes` feed policy conditions (Chapter 3) — pass `{}` for now.

Resource types support **hierarchical matching** with dots: a permission on
`dashboard` also covers `dashboard.users` and `dashboard.settings`. See Chapter 5.

## Engine Configuration

```typescript
const engine = new Engine({
  adapter,                    // required: where to load data from
  mode: 'development',        // optional: 'development' | 'production' (default: 'development')
  defaultEffect: 'deny',     // optional: what to return when no rules match (default: 'deny')
  cacheTTL: 60,              // optional: cache lifetime in seconds (default: 60)
  maxCacheSize: 1000,         // optional: max cached subjects (default: 1000)
  hooks: { ... },             // optional: lifecycle hooks (Chapter 4)
})
```

| Parameter | Default | Description |
| --- | --- | --- |
| `adapter` | required | Data source for roles, policies, assignments. |
| `mode` | `'development'` | `'development'` or `'production'` — controls verbosity and debug behavior. |
| `defaultEffect` | `'deny'` | What to return when no rule matches. Stay with `'deny'` for security. |
| `cacheTTL` | `60` | Cache lifetime in seconds. Set `0` in tests. |
| `maxCacheSize` | `1000` | Max subjects cached in memory. LRU eviction. |
| `hooks` | `{}` | Lifecycle hooks for enrichment, logging, error handling (Chapter 4). |

Defaults are fine for now.

## Checkpoint

Your project should look like this:

```
blogduck/
  src/
    access.ts    -- role + adapter + engine
    main.ts      -- permission checks
  package.json
  tsconfig.json
```

  
    Full `src/access.ts`
    

```typescript

export const viewer = defineRole('viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()

const adapter = new MemoryAdapter({
  roles: [viewer],
  assignments: {
    'alice': ['viewer'],
  },
})

export const engine = new Engine({ adapter }) // defaults to mode: 'development'
```

    
  

  
    Full `src/main.ts`
    

```typescript

async function main() {
  // Boolean check
  const canRead = await engine.can('alice', 'read', { type: 'post', attributes: {} })
  console.log('Alice can read post:', canRead)  // true

  const canDelete = await engine.can('alice', 'delete', { type: 'post', attributes: {} })
  console.log('Alice can delete post:', canDelete)  // false

  // Full decision
  const decision = await engine.check('alice', 'read', { type: 'post', attributes: {} })
  console.log('Decision:', decision.reason)  // Allowed by rule "rbac.viewer.read.post.0"
  console.log('Duration:', decision.duration, 'ms')
}

main()
```

    
  

---

## Chapter 1 FAQ

  
    Why is engine.can() async?
    
      Adapters can be databases or HTTP services. Even though `MemoryAdapter` is synchronous,
      the engine API is async to support all adapter types uniformly. The engine caches
      aggressively so subsequent calls are fast even with async adapters.
    
  

  
    Why do I need to pass empty attributes?
    
      `attributes` is required because conditions (Chapter 3) read resource metadata from it.
      Passing `{}` means "no extra metadata." If a policy checks a field that is missing,
      the condition resolves to `null` and deny rules fire -- the safe default.
    
  

  
    Why is delete denied? I did not write a deny rule.
    
      duck-iam defaults to deny. If no rule explicitly allows an action, the result is deny
      ("fail closed"). For basic RBAC, you never write deny rules -- just omit the permission.
      You can change this with `defaultEffect: 'allow'`, but avoid it for security reasons.
    
  

  
    What is the difference between engine.can() and engine.check()?
    
      `can()` returns a `boolean`. `check()` returns the full `Decision` object with `allowed`,
      `effect`, `reason`, `duration`, `timestamp`, and the deciding `policy` and `rule`.
      Both call the same evaluation logic internally.
    
  

  
    Can the subject ID be anything?
    
      Yes, any string: UUID, email, username, database ID. Use the same format when assigning
      roles and when checking permissions.
    
  

  
    What is engine.authorize()?
    
      The low-level evaluation method. It takes a full `AccessRequest` object and returns a
      `Decision`. Both `can()` and `check()` call `authorize()` internally after resolving
      the subject. Useful for advanced cases where you manage subject resolution yourself.
    
  

  
    What happens if the subject ID does not exist?
    
      The adapter returns an empty role array and empty attributes. No rules match, so the
      default effect (deny) applies. Unknown users are always denied automatically.
    
  

  
    Can a user have multiple roles?
    
      Yes: `'alice': ['viewer', 'commenter']`. The engine resolves permissions from all
      assigned roles and their ancestors, deduplicates, and combines with `allow-overrides`.
      If any role grants a permission, the RBAC layer allows it.
    
  

  
    What other adapters are available besides MemoryAdapter?
    
      duck-iam ships with four: `MemoryAdapter` (in-memory, for dev/testing),
      `PrismaAdapter` (Prisma ORM), `DrizzleAdapter` (Drizzle ORM), and `HttpAdapter`
      (remote REST API). You can also implement the `Adapter` interface directly.
      All adapters are covered in Chapter 8.
    
  

---

Next: [Chapter 2: Role Hierarchies](/docs/course/chapter-2)