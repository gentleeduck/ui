## Defining Roles

Roles are the RBAC side of duck-iam. Build them with `defineRole()`, granting
permissions as action/resource pairs. At evaluation time, roles convert to ABAC
policies and run through the same engine as hand-written ones.

```typescript

const viewer = defineRole('viewer')
  .name('Viewer')
  .desc('Read-only access to published content')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()
```

`defineRole()` returns a `RoleBuilder`. `.build()` produces the plain `Role` object.

### Role object structure

```typescript
interface Role {
  id: string
  name: string
  description?: string
  permissions: readonly Permission[]
  inherits?: readonly string[]
  scope?: string
  metadata?: Record

```typescript
const viewer = defineRole('viewer')
  .name('Viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()

const editor = defineRole('editor')
  .name('Editor')
  .inherits('viewer')
  .grant('create', 'post')
  .grant('update', 'post')
  .grant('delete', 'post')
  .build()

const admin = defineRole('admin')
  .name('Admin')
  .inherits('editor')
  .grantAll('*')
  .build()
```

Chain: `viewer -> editor -> admin`. An admin gets everything an editor can do
(including everything a viewer can do), plus unrestricted access.

### How inheritance is resolved

The engine calls `resolveEffectiveRoles()` when loading a subject. For a user with
`editor`, the function walks the inheritance tree and returns `['editor', 'viewer']` —
the effective role set.

`rolesToPolicy()` flattens the inheritance chain when generating the ABAC policy. The
editor role's rules include its own and viewer's permissions, each gated by a
`subject.roles contains "editor"` condition.

Cycles are safe. If role A inherits from B which inherits from A, the visited set
breaks the recursion.

### Multiple inheritance

A role can inherit from several parents:

```typescript
const moderator = defineRole('moderator')
  .name('Moderator')
  .inherits('viewer', 'commenter')
  .grant('delete', 'comment')
  .grant('update', 'comment')
  .build()
```

This pulls permissions from `viewer` and `commenter`, then adds the moderator's own.

## Scoped Roles (Multi-Tenancy)

Scopes restrict roles to specific tenants, organizations, or workspaces. Two
mechanisms: role-level scopes and permission-level scopes.

### Role-level scope

A scope on a role limits all its permissions to that scope:

```typescript
const orgEditor = defineRole('org-editor')
  .name('Org Editor')
  .scope('org-1')
  .grant('create', 'post')
  .grant('update', 'post')
  .build()
```

When converted to policy rules, each rule gets an extra `scope eq "org-1"` condition.
The permission only fires when the request scope matches.

### Permission-level scope

Scope individual permissions by passing an optional third argument to `grant()`:

```typescript
const hybridRole = defineRole('hybrid')
  .name('Hybrid Role')
  .grant('read', 'post')                    // global -- no scope restriction
  .grant('update', 'post', 'org-1')          // only in org-1
  .grant('create', 'comment', 'org-2')       // only in org-2
  .build()
```

`read` works everywhere; `update` only in `org-1`; `create` only in `org-2`.
`grantScoped(scope, action, resource)` does the same thing with scope first.

### Scoped role assignments

A user can have `editor` globally and `admin` only in `org-1`:

```typescript
// In the adapter / admin API:
await engine.admin.assignRole('user-1', 'editor')              // global
await engine.admin.assignRole('user-1', 'admin', 'org-1')      // scoped

// When checking access:
const allowed = await engine.can(
  'user-1',
  'delete',
  { type: 'post', attributes: {} },
  undefined,  // environment
  'org-1',    // scope
)
// user-1 has admin in org-1, so delete is allowed
```

When a request carries a scope, the engine merges matching scoped role assignments
into the subject. The `admin` role only joins `subject.roles` for requests with
`scope: "org-1"`.

## Conditional Permissions with grantWhen

`grantWhen()` attaches conditions to a permission:

```typescript
const author = defineRole('author')
  .name('Author')
  .grant('create', 'post')
  .grant('read', 'post')
  .grantWhen('update', 'post', w => w.isOwner())
  .grantWhen('delete', 'post', w => w.isOwner())
  .build()
```

Authors can create and read any post, but only update or delete posts they own.
`isOwner()` produces `resource.attributes.ownerId eq $subject.id`. `$subject.id` is a
variable reference resolved at evaluation time.

  **Per-resource narrowing:** When using `createAccessConfig()` with a typed `context`
  and `resourceAttributes`, calling `.grantWhen('update', 'post', w => ...)` narrows
  `w.resourceAttr()` to only attributes defined for posts. See the
  [typed context docs](/docs/advanced/config#per-resource-attribute-narrowing) for details.

### Complex conditional permissions

The `grantWhen()` callback gets a `When` builder:

```typescript
const teamLead = defineRole('team-lead')
  .name('Team Lead')
  .grant('read', 'report')
  .grantWhen('approve', 'expense', w => w
    .attr('department', 'eq', 'engineering')
    .resourceAttr('amount', 'lte', 10000)
  )
  .build()
```

This grants `approve` on expenses only when the subject is in engineering AND the
amount is at most 10,000.

## Shorthand Methods

### grantAll(resource)

Grants all actions (`'*'`) on a resource:

```typescript
const superAdmin = defineRole('super-admin')
  .name('Super Admin')
  .grantAll('*')   // all actions on all resources
  .build()

const postAdmin = defineRole('post-admin')
  .name('Post Admin')
  .grantAll('post')  // all actions on posts
  .build()
```

### grantCRUD(resource)

Grants `create`, `read`, `update`, and `delete` on a resource. Skips custom actions
like `publish` or `archive`.

```typescript
const contentManager = defineRole('content-manager')
  .name('Content Manager')
  .grantCRUD('post')
  .grantCRUD('comment')
  .build()

// Equivalent to:
// .grant('create', 'post')
// .grant('read', 'post')
// .grant('update', 'post')
// .grant('delete', 'post')
// .grant('create', 'comment')
// .grant('read', 'comment')
// .grant('update', 'comment')
// .grant('delete', 'comment')
```

### grantRead(resources...)

Grants `read` on one or more resources:

```typescript
const auditor = defineRole('auditor')
  .name('Auditor')
  .grantRead('post', 'comment', 'user', 'audit-log')
  .build()

// Equivalent to:
// .grant('read', 'post')
// .grant('read', 'comment')
// .grant('read', 'user')
// .grant('read', 'audit-log')
```

### grantScoped(scope, action, resource)

Grants a single permission restricted to a scope:

```typescript
const orgViewer = defineRole('org-viewer')
  .name('Org Viewer')
  .grantScoped('org-1', 'read', 'post')
  .grantScoped('org-1', 'read', 'comment')
  .grantScoped('org-2', 'read', 'post')
  .build()
```

### meta(metadata)

Attaches arbitrary metadata to a role. Ignored during evaluation — for application
code like admin dashboards, audit logs, and UI labels.

```typescript
const role = defineRole('beta-tester')
  .name('Beta Tester')
  .meta({ createdBy: 'system', tier: 'beta', maxSeats: 10 })
  .grant('read', 'beta-feature')
  .build()

// Access metadata later:
console.log(role.metadata)
// { createdBy: 'system', tier: 'beta', maxSeats: 10 }
```

## Edge Cases

- **Empty permissions**: a role with no permissions and no inheritance is valid but
  grants nothing. `validateRoles()` flags it as a warning.
- **Deep inheritance chains**: resolved by walking the tree recursively, with a visited
  set to break cycles. Performance is linear in the role count — 10-level chains
  resolve in microseconds.
- **Removing inherited permissions**: not supported. If `editor` inherits `viewer`,
  viewer's `read` can't be stripped from the editor. Use an ABAC deny rule for
  finer-grain control.
- **Wildcard scope**: `scope: '*'` matches every scope, including requests without one.
  Use it for global permissions.

## How Roles Become Policies (rolesToPolicy)

`rolesToPolicy()` turns role definitions into one ABAC policy.

For each role, the function:

1. Flattens the inheritance chain into all permissions (own and inherited).
2. Creates a Rule per permission with:
   - `effect: "allow"`
   - `actions` and `resources` from the permission
   - `subject.roles contains "<roleId>"` as a condition
   - `scope eq "<scope>"` when the permission or role is scoped
   - Any conditions from `grantWhen()`
   - `priority: 10` (default)
3. Wraps the rules in a policy with `id: "__rbac__"` and `algorithm: "allow-overrides"`.

The viewer role after conversion:

```typescript
// Input:
const viewer = defineRole('viewer')
  .name('Viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()

// Generated policy (conceptual):
{
  id: '__rbac__',
  name: 'RBAC Policies',
  algorithm: 'allow-overrides',
  rules: [
    {
      id: 'rbac.viewer.read.post.0',
      effect: 'allow',
      actions: ['read'],
      resources: ['post'],
      conditions: {
        all: [{ field: 'subject.roles', operator: 'contains', value: 'viewer' }]
      }
    },
    {
      id: 'rbac.viewer.read.comment.1',
      effect: 'allow',
      actions: ['read'],
      resources: ['comment'],
      conditions: {
        all: [{ field: 'subject.roles', operator: 'contains', value: 'viewer' }]
      }
    }
  ]
}
```

`allow-overrides` means any role granting the permission is enough — a user with
multiple roles gets the union of their permissions.

## Type-Safe Roles with createAccessConfig

`createAccessConfig()` returns typed builders. With `roles` declared, the role ID
parameter on `defineRole()` and the `.role()` / `.roles()` methods on conditions are
constrained to those values.

```typescript

const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete', 'publish'] as const,
  resources: ['post', 'comment', 'user'] as const,
  scopes: ['org-1', 'org-2'] as const,
  roles: ['viewer', 'editor', 'admin'] as const,
})

// These builders are fully typed -- invalid actions/resources/roles are compile errors
const viewer = access.defineRole('viewer')    // ok -- 'viewer' is in roles
  .name('Viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  // .grant('fly', 'post')       // TypeScript error: 'fly' is not a valid action
  // access.defineRole('intern')  // TypeScript error: 'intern' is not a valid role
  .build()

// Role checks in conditions are also typed
const ownerPolicy = access.policy('owner-only')
  .rule('admin-override', r => r
    .allow()
    .on('*').of('*')
    .when(w => w.role('admin'))      // ok -- 'admin' is in roles
    // .when(w => w.role('manager')) // TypeScript error: 'manager' is not a valid role
  )
  .build()
```

`access.defineRole()`, `access.policy()`, `access.defineRule()`, and `access.when()`
return builders constrained to the declared actions, resources, scopes, and roles. The
types flow through the chain, from `grantWhen()` callbacks to `whenAny()` conditions.

## Validating Roles

Before saving roles to your adapter, validate them for common mistakes:

```typescript

const access = createAccessConfig({
  actions: ['read', 'write'] as const,
  resources: ['post'] as const,
})

const roles = [viewer, editor, admin]
const result = access.validateRoles(roles)

if (!result.valid) {
  console.error('Role validation errors:')
  for (const issue of result.issues) {
    console.error(`  [${issue.type}] ${issue.message}`)
  }
}
```

The validator checks for:

- Duplicate role IDs
- Dangling `inherits` references (inheriting from a role that does not exist)
- Inheritance cycles (A inherits B, B inherits A)
- Empty permission lists

## Complete Example

```typescript

const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete', 'publish', 'archive'] as const,
  resources: ['post', 'comment', 'user', 'settings'] as const,
  scopes: ['org-alpha', 'org-beta'] as const,
  roles: ['viewer', 'author', 'editor', 'org-admin', 'super-admin'] as const,
})

const viewer = access.defineRole('viewer')
  .name('Viewer')
  .grantRead('post', 'comment')
  .build()

const author = access.defineRole('author')
  .name('Author')
  .inherits('viewer')
  .grant('create', 'post')
  .grantWhen('update', 'post', w => w.isOwner())
  .grantWhen('delete', 'post', w => w.isOwner())
  .grant('create', 'comment')
  .build()

const editor = access.defineRole('editor')
  .name('Editor')
  .inherits('author')
  .grant('update', 'post')
  .grant('delete', 'post')
  .grant('publish', 'post')
  .grant('archive', 'post')
  .grantCRUD('comment')
  .build()

const orgAdmin = access.defineRole('org-admin')
  .name('Organization Admin')
  .inherits('editor')
  .grantCRUD('user')
  .grantCRUD('settings')
  .build()

const superAdmin = access.defineRole('super-admin')
  .name('Super Admin')
  .grantAll('*')
  .build()

// Validate before saving
const validation = access.validateRoles([viewer, author, editor, orgAdmin, superAdmin])
console.log(validation.valid) // true

// Save to adapter
for (const role of [viewer, author, editor, orgAdmin, superAdmin]) {
  await engine.admin.saveRole(role)
}
```

---

## Roles FAQ

  
    Why are my scoped roles ignored unless I pass a scope?
    
      duck-iam keeps global roles and scoped role assignments separate. A scoped assignment becomes active
      only when the current request carries the same scope, which prevents tenant-specific grants from
      leaking into unscoped or cross-tenant checks.
    
  

  
    Can one subject have global and scoped roles at the same time?
    
      Yes. That is a common multi-tenant setup. Global roles continue to apply everywhere, while scoped roles
      are merged in only for matching scopes.
    
  

  
    When should I use role-level scope, permission-level scope, or scoped assignments?
    
      Use scoped assignments when the same role should be granted in one tenant but not another. Use role-level
      scope when the whole role is inherently tenant-bound. Use permission-level scope when only a few grants on
      the role should be restricted to a specific scope.
    
  

  
    Why are circular inherits warnings instead of hard errors?
    
      The runtime handles cycles safely with visited-set traversal, so evaluation does not break. Validation still
      warns because circular inheritance is almost always a modeling mistake even when it is survivable.
    
  

  
    Should I create org-admin-acme style role IDs, or keep one role and scope the assignment?
    
      Prefer one reusable role definition plus scoped assignments when the permission shape is the same across tenants.
      Create tenant-specific role IDs only when the role definition itself truly differs by tenant and you want those
      differences versioned as separate roles.
    
  

  
    When should owner-only or attribute checks stay on a role with grantWhen() instead of moving to a policy?
    
      Keep the condition on the role when it is part of the role's natural meaning, such as "authors can edit their own posts."
      Move it into a standalone policy when the rule cuts across many roles, needs its own lifecycle, or reads more clearly as a
      global restriction than as role-local logic.
    
  

  
    What happens if one role mixes global permissions and scope-bound permissions?
    
      The global permissions remain active everywhere. The scoped permissions only activate when the request carries the matching
      scope. This lets one role express "read everywhere, but update only inside org-1" without splitting into separate role IDs.
    
  

  
    Do inherited permissions keep honoring role-level and permission-level scopes?
    
      Yes. Inheritance flattens permissions, but the scope constraints attached to those permissions still travel with them when
      they are converted into the synthetic RBAC policy. Inheritance does not erase scope checks.