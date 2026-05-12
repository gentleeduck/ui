## Goal

BlogDuck needs more than viewers. Add an **editor** who can create and update posts,
and an **admin** who can do everything. Use inheritance so each role builds on the
one below it.

read post, read comment"] --> E["editor+ create post, update post+ create comment, update comment"]
  E --> A["admin+ delete post, delete comment+ manage user, manage dashboard"]`}
/>

## Building the Hierarchy

**Add the editor role**

The editor inherits from viewer and adds create/update permissions:

```typescript title="src/access.ts"
export const editor = defineRole('editor')
  .inherits('viewer')
  .grant('create', 'post')
  .grant('update', 'post')
  .grant('create', 'comment')
  .grant('update', 'comment')
  .build()
```

Because editor inherits viewer, the editor gets `read:post` and `read:comment`
without listing them again.

**Add the admin role**

The admin inherits from editor (which inherits from viewer):

```typescript title="src/access.ts"
export const admin = defineRole('admin')
  .inherits('editor')
  .grant('delete', 'post')
  .grant('delete', 'comment')
  .grant('manage', 'user')
  .grant('manage', 'dashboard')
  .build()
```

Admin gets viewer + editor + admin permissions across three inheritance
levels.

**Register all roles and assign users**

```typescript title="src/access.ts"
const adapter = new MemoryAdapter({
  roles: [viewer, editor, admin],
  assignments: {
    'alice': ['viewer'],
    'bob': ['editor'],
    'charlie': ['admin'],
  },
})

export const engine = new Engine({ adapter }) // mode defaults to 'development'
```

**Test the hierarchy**

```typescript title="src/main.ts"
import { engine } from './access'

async function main() {
  // Viewer: can read, cannot create
  console.log('alice read post:', await engine.can('alice', 'read', { type: 'post', attributes: {} }))
  // true
  console.log('alice create post:', await engine.can('alice', 'create', { type: 'post', attributes: {} }))
  // false

  // Editor: can read (inherited) + create
  console.log('bob read post:', await engine.can('bob', 'read', { type: 'post', attributes: {} }))
  // true
  console.log('bob create post:', await engine.can('bob', 'create', { type: 'post', attributes: {} }))
  // true
  console.log('bob delete post:', await engine.can('bob', 'delete', { type: 'post', attributes: {} }))
  // false

  // Admin: can do everything
  console.log('charlie delete post:', await engine.can('charlie', 'delete', { type: 'post', attributes: {} }))
  // true
  console.log('charlie manage user:', await engine.can('charlie', 'manage', { type: 'user', attributes: {} }))
  // true
}

main()
```

## How Inheritance Resolution Works

viewer + editor + admin"]
  end

  subgraph Safety["Cycle Detection"]
      direction TB
      V["visited = Set()"]
      V --> V1["Visit admin -> add to set"]
      V1 --> V2["Visit editor -> add to set"]
      V2 --> V3["Visit viewer -> add to set"]
      V3 --> V4["If seen before -> skip"]
  end

  Resolve ~~~ Safety`}
/>

The engine calls `resolveEffectiveRoles()`, walking the inheritance chain recursively
with a visited set to break circular inheritance (A inherits B, B inherits A). Cycles
are skipped, not raised as errors.

Charlie's resolved roles: `['admin', 'editor', 'viewer']`. All three roles'
permissions land in the `__rbac__` policy.

## Multiple Inheritance

A role can inherit from several parents:

```typescript
const commenter = defineRole('commenter')
  .grant('create', 'comment')
  .grant('update', 'comment')
  .build()

const moderator = defineRole('moderator')
  .inherits('viewer', 'commenter')
  .grant('delete', 'comment')
  .build()
```

The moderator gets `read:post` and `read:comment` from viewer, `create:comment` and
`update:comment` from commenter, plus its own `delete:comment`. Duplicates are
deduplicated automatically.

## The Complete RoleBuilder API

`defineRole()` returns a `RoleBuilder` with these methods:

### Core Methods

```typescript
defineRole('editor')
  .name('Content Editor')          // human-readable name (defaults to the role ID)
  .desc('Can create and edit content')  // description
  .inherits('viewer', 'commenter') // inherit from one or more parent roles
  .scope('acme')                   // restrict this role to a scope (Chapter 5)
  .meta({ department: 'content' }) // attach arbitrary metadata
  .grant('create', 'post')        // grant a permission
  .build()                        // produce the Role object
```

| Method | Description |
| --- | --- |
| `.name(n)` | Set a human-readable display name |
| `.desc(d)` | Set a description |
| `.inherits(...ids)` | Inherit permissions from parent roles |
| `.scope(s)` | Restrict all permissions to a specific scope (Chapter 5) |
| `.meta(m)` | Attach arbitrary metadata (e.g., `{ color: 'blue' }`) |
| `.grant(action, resource)` | Grant a single permission |
| `.build()` | Produce the immutable `Role` object |

### Grant Shortcuts

```typescript
// Grant all CRUD actions on a resource
defineRole('post-manager')
  .grantCRUD('post')
  // Equivalent to:
  // .grant('create', 'post')
  // .grant('read', 'post')
  // .grant('update', 'post')
  // .grant('delete', 'post')
  .build()

// Grant all actions on a resource (wildcard)
defineRole('post-superuser')
  .grantAll('post')
  // Equivalent to: .grant('*', 'post')
  .build()

// Grant read access to multiple resources
defineRole('reader')
  .grantRead('post', 'comment', 'user')
  // Equivalent to:
  // .grant('read', 'post')
  // .grant('read', 'comment')
  // .grant('read', 'user')
  .build()

// Grant a permission scoped to a specific tenant
defineRole('org-editor')
  .grantScoped('acme', 'create', 'post')
  .grantScoped('acme', 'update', 'post')
  // These permissions only apply when scope is 'acme'
  .build()

// Grant with conditions (Chapter 3 preview)
defineRole('self-editor')
  .grantWhen('update', 'post', w => w.isOwner())
  // This permission only applies when the user owns the resource
  .build()
```

| Shortcut | Equivalent | Description |
| --- | --- | --- |
| `.grantCRUD(resource)` | `.grant('create/read/update/delete', resource)` | All CRUD operations |
| `.grantAll(resource)` | `.grant('*', resource)` | All actions (wildcard) |
| `.grantRead(...resources)` | `.grant('read', each)` | Read on multiple resources |
| `.grantScoped(scope, action, resource)` | Permission with scope field | Scoped permission |
| `.grantWhen(action, resource, conditions)` | Permission with conditions | Conditional grant |

## The Permission Object

Each `.grant()` call creates a `Permission` object inside the role:

```typescript
interface Permission {
  action: string | '*'       // the action this permission grants
  resource: string | '*'     // the resource type
  scope?: string | '*'       // optional: restrict to a scope
  conditions?: ConditionGroup // optional: conditions that must pass
}
```

`.grant('read', 'post')` produces `{ action: 'read', resource: 'post' }`. Add `scope`
with an optional third argument to `.grant()` (e.g. `.grant('read', 'post', 'org-1')`)
or with `.grantScoped()`. Add `conditions` with `.grantWhen()`.

## The Role Object

After calling `.build()`, you get a plain `Role` object:

```typescript
interface Role {
  id: string                // unique identifier
  name: string              // human-readable name
  description?: string      // optional description
  permissions: Permission[] // array of granted permissions
  inherits?: string[]       // parent role IDs
  scope?: string            // optional role-level scope
  metadata?: Attributes     // optional arbitrary metadata
}
```

It's serializable — store it in a database, send it over HTTP, or log it.

## Wildcards

Use `'*'` to match any action or resource:

```typescript
// Full access to everything
const superadmin = defineRole('superadmin')
  .grant('*', '*')
  .build()

// All actions on posts only
const postManager = defineRole('post-manager')
  .grant('*', 'post')
  .build()

// Read access to everything
const auditor = defineRole('auditor')
  .grant('read', '*')
  .build()
```

### Hierarchical Wildcards

Actions and resources support colon-based hierarchy patterns:

```typescript
// Grant all post-related actions
defineRole('post-admin')
  .grant('posts:*', 'post')  // matches posts:create, posts:read, etc.
  .build()

// Grant access to org and all sub-resources
defineRole('org-viewer')
  .grant('read', 'org')  // also matches org:project, org:project:doc
  .build()
```

The matching rules:

* `'*'` matches any value
* `'posts:*'` matches any action starting with `posts:` (e.g., `posts:create`, `posts:read`)
* `'org'` as a resource also matches `'org:project'` and `'org:project:doc'` (hierarchical)

Dot-based resource hierarchies (`dashboard.users`) are covered in Chapter 5.

## Validating Roles

Validate your role configuration at startup to catch mistakes early:

```typescript
import { validateRoles } from '@gentleduck/iam'

const result = validateRoles([viewer, editor, admin])

if (!result.valid) {
  throw new Error('Role config error: ' + result.issues.map(i => i.message).join(', '))
}
```

### ValidationResult and ValidationIssue

```typescript
interface ValidationResult {
  valid: boolean               // true if no error-level issues
  issues: ValidationIssue[]    // all issues found
}

interface ValidationIssue {
  type: 'error' | 'warning'   // errors prevent startup, warnings are informational
  code: string                 // machine-readable code
  message: string              // human-readable description
  roleId?: string              // which role caused the issue
  path?: string                // field path (if applicable)
}
```

### What It Catches

| Issue | Code | Severity | Example |
| --- | --- | --- | --- |
| Duplicate role IDs | `DUPLICATE_ROLE_ID` | error | Two roles both called `'editor'` |
| Dangling inherits | `DANGLING_INHERIT` | error | `editor` inherits `'reviewer'` which does not exist |
| Circular inheritance | `CIRCULAR_INHERIT` | warning | `a` inherits `b`, `b` inherits `a` |
| Empty roles | `EMPTY_ROLE` | warning | Role with no permissions and no inheritance |

`valid` is `false` only when there are `error`-level issues. Warnings are informational;
the engine still works (cycles are skipped, empty roles do nothing).

Validate at startup. It is cheap and prevents silent failures at runtime.

## Checkpoint

Full `src/access.ts`

```typescript
import { defineRole, Engine, validateRoles } from '@gentleduck/iam'
import { MemoryAdapter } from '@gentleduck/iam/adapters/memory'

export const viewer = defineRole('viewer')
  .name('Viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()

export const editor = defineRole('editor')
  .name('Editor')
  .inherits('viewer')
  .grant('create', 'post')
  .grant('update', 'post')
  .grant('create', 'comment')
  .grant('update', 'comment')
  .build()

export const admin = defineRole('admin')
  .name('Administrator')
  .inherits('editor')
  .grant('delete', 'post')
  .grant('delete', 'comment')
  .grant('manage', 'user')
  .grant('manage', 'dashboard')
  .build()

// Validate at startup
const roleCheck = validateRoles([viewer, editor, admin])
if (!roleCheck.valid) {
  throw new Error(roleCheck.issues.map(i => `[${i.code}] ${i.message}`).join(', '))
}

const adapter = new MemoryAdapter({
  roles: [viewer, editor, admin],
  assignments: {
    'alice': ['viewer'],
    'bob': ['editor'],
    'charlie': ['admin'],
  },
})

export const engine = new Engine({ adapter }) // mode defaults to 'development'
```

***

## Chapter 2 FAQ

Is there a limit on inheritance depth?

No hard limit. The engine uses a visited-set to prevent cycles, so deep chains are safe.
In practice, 3-5 levels is common. Deeper chains become hard to reason about, which is
the bigger problem.

Can a child role remove a permission from its parent?

No. RBAC inheritance is additive: a child always has at least the parent's permissions
plus its own. To restrict specific actions, use ABAC policies with deny rules (Chapter 3).
An editor who cannot delete uses the editor role for grants and a policy for the deny.

Can a user have multiple roles directly?

Yes. The assignments map takes an array of role IDs:
`'alice': ['viewer', 'commenter']`. The engine resolves permissions from all assigned roles
and their ancestors, deduplicates them, and combines them with `allow-overrides`. If any
role grants a permission, the RBAC layer allows it.

Is the wildcard dangerous?

`grant('*', '*')` gives full RBAC access. ABAC policies can still deny specific actions
(Chapter 3), so it is not a blanket bypass. Reserve it for superadmin roles. A policy with
`deny-overrides` can override even wildcard RBAC grants.

When should I call validateRoles()?

At application startup, before handling any requests. It is synchronous and instant.
Add it to your initialization code alongside engine creation. Do not skip it in
production -- it catches typos that would otherwise silently fail at runtime.

When should I use grantCRUD vs individual grants?

Use `grantCRUD(resource)` when a role needs all four CRUD operations on a resource.
Use individual `.grant()` calls when a role only needs some operations, or when your
actions are not standard CRUD (e.g., `manage`, `publish`, `approve`). Both produce
identical `Permission` objects.

What is role metadata used for?

`.meta()` attaches arbitrary key-value data to a role. The engine ignores it for
authorization. Use it for application concerns: display names, colors, icons, sort order,
feature flags, or anything else you want to associate with a role. It is stored alongside
the role in the adapter.

What does .scope() on a role do?

`.scope('acme')` restricts all permissions in the role to the `acme` scope.
The permissions only match when the request has `scope: 'acme'`. This differs from
`.grantScoped()`, which scopes individual permissions. Role-level scoping is a shorthand
for scoping every permission in the role. Covered in detail in Chapter 5.

***

Next: [Chapter 3: Policies, Rules, and Conditions](/duck-iam/course/chapter-3)