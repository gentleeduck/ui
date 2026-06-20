## defineIam basics

`defineIam()` returns typed builders. With `roles` declared, the role ID parameter on `defineRole()` and the `.role()` / `.roles()` methods on conditions are constrained to those values.

```typescript
import { defineIam } from '@gentleduck/iam'

const access = defineIam({
  actions: ['create', 'read', 'update', 'delete', 'publish'] as const,
  resources: ['post', 'comment', 'user'] as const,
  scopes: ['org-1', 'org-2'] as const,
  roles: ['viewer', 'editor', 'admin'] as const,
})
```

`as const` is required - without it, TypeScript widens the arrays to `string[]` and you lose the constraint.

***

## What gets constrained

```typescript
// These builders are fully typed -- invalid actions/resources/roles are compile errors

const viewer = access
  .defineRole('viewer') // ok -- 'viewer' is in roles
  .name('Viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  // .grant('fly', 'post')         // TS error: 'fly' is not in actions
  // access.defineRole('intern')   // TS error: 'intern' is not in roles
  .build()

// Role checks in conditions are also typed
const ownerPolicy = access
  .definePolicy('owner-only')
  .rule('admin-override', (r) =>
    r
      .allow()
      .on('*')
      .of('*')
      .when((w) => w.role('admin')) // ok -- 'admin' is in roles
      // .when(w => w.role('manager')) // TS error: 'manager' is not in roles
  )
  .build()
```

`access.defineRole()`, `access.definePolicy()`, `access.defineRule()`, and `access.when()` return builders constrained to the declared actions, resources, scopes, and roles. Types flow through the chain - from `grantWhen()` callbacks to `whenAny()` conditions.

***

## Validating roles

Before saving roles to your adapter, validate them for common mistakes:

```typescript
import { defineIam } from '@gentleduck/iam'

const access = defineIam({
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

* Duplicate role IDs
* Dangling `inherits` references (inheriting from a role that doesn't exist)
* Inheritance cycles (A inherits B, B inherits A)
* Empty permission lists

Issues come in two severity levels:

* `error` - blocking (the model is broken)
* `warning` - suspicious but survivable (e.g. cycles, empty roles)

***

## Edge cases

* **Empty permissions** - a role with no permissions and no inheritance is valid but grants nothing. Flagged as a warning.
* **Deep inheritance chains** - resolved by walking the tree recursively, with a visited set to break cycles. Performance is linear in role count - 10-level chains resolve in microseconds.
* **Removing inherited permissions** - not supported. Use a deny rule instead. See [inheritance](/duck-iam/core/roles/inheritance).
* **Wildcard scope** - `scope: '*'` matches every scope, including unscoped requests. Use for global permissions.

***

## Per-resource attribute narrowing

Pass a `context` phantom field to enable resource-aware autocomplete in `grantWhen()`:

```typescript
const access = defineIam({
  actions: ['read', 'update'] as const,
  resources: ['post', 'invoice'] as const,
  context: {} as {
    subject: { id: string; attributes: { tier: 'free' | 'pro' } }
    resourceAttributes: {
      post: { ownerId: string; status: 'draft' | 'published' }
      invoice: { customerId: string; amount: number }
    }
  },
})

const editor = access
  .defineRole('editor')
  .grantWhen('update', 'post', (w) =>
    w.resourceAttr('status', 'eq', 'draft'), // editor autocomplete: 'ownerId' | 'status'
  )
  .grantWhen('update', 'invoice', (w) =>
    w.resourceAttr('amount', 'lt', 1000), // editor autocomplete: 'customerId' | 'amount'
  )
  .build()
```

The same builder calls produce different autocomplete suggestions based on which resource you're targeting. See the [type-safe config](/duck-iam/advanced/config) docs for the full schema.

***

## Complete example

```typescript
import { defineIam } from '@gentleduck/iam'

const access = defineIam({
  actions: ['create', 'read', 'update', 'delete', 'publish', 'archive'] as const,
  resources: ['post', 'comment', 'user', 'settings'] as const,
  scopes: ['org-alpha', 'org-beta'] as const,
  roles: ['viewer', 'author', 'editor', 'org-admin', 'super-admin'] as const,
})

const viewer = access.defineRole('viewer').name('Viewer').grantRead('post', 'comment').build()

const author = access
  .defineRole('author')
  .name('Author')
  .inherits('viewer')
  .grant('create', 'post')
  .grantWhen('update', 'post', (w) => w.isOwner())
  .grantWhen('delete', 'post', (w) => w.isOwner())
  .grant('create', 'comment')
  .build()

const editor = access
  .defineRole('editor')
  .name('Editor')
  .inherits('author')
  .grant('update', 'post')
  .grant('delete', 'post')
  .grant('publish', 'post')
  .grant('archive', 'post')
  .grantCRUD('comment')
  .build()

const orgAdmin = access
  .defineRole('org-admin')
  .name('Organization Admin')
  .inherits('editor')
  .grantCRUD('user')
  .grantCRUD('settings')
  .build()

const superAdmin = access.defineRole('super-admin').name('Super Admin').grantAll('*').build()

// Validate before saving
const validation = access.validateRoles([viewer, author, editor, orgAdmin, superAdmin])
console.log(validation.valid) // true

// Save to adapter
for (const role of [viewer, author, editor, orgAdmin, superAdmin]) {
  await engine.admin.saveRole(role)
}
```