## Basic role

```typescript
import { defineRole } from '@gentleduck/iam'

const viewer = defineRole('viewer')
  .name('Viewer')
  .desc('Read-only access to published content')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()
```

Builder methods cascade. `.build()` returns the plain `Role` object.

---

## Grant variants

Common patterns have direct shortcuts:

### `grant(action, resource, scope?)`

The base method. Adds a single permission:

```typescript
.grant('create', 'post')                  // unscoped
.grant('update', 'post', 'org-1')          // scoped to org-1
```

### `grantAll(resource)`

All actions (`'*'`) on a resource:

```typescript
const superAdmin = defineRole('super-admin').grantAll('*').build() // everything
const postAdmin = defineRole('post-admin').grantAll('post').build() // any action on post
```

### `grantCRUD(resource)`

`create`, `read`, `update`, `delete` on a resource. Skips custom actions like `publish` or `archive`:

```typescript
const contentManager = defineRole('content-manager').grantCRUD('post').grantCRUD('comment').build()

// Equivalent to:
// .grant('create', 'post')
// .grant('read', 'post')
// .grant('update', 'post')
// .grant('delete', 'post')
// .grant('create', 'comment')
// ... etc
```

### `grantRead(...resources)`

`read` on one or more resources:

```typescript
const auditor = defineRole('auditor')
  .grantRead('post', 'comment', 'user', 'audit-log')
  .build()
```

### `grantScoped(scope, action, resource)`

Single permission restricted to a scope:

```typescript
const orgViewer = defineRole('org-viewer')
  .grantScoped('org-1', 'read', 'post')
  .grantScoped('org-2', 'read', 'post')
  .build()
```

Equivalent to `grant('read', 'post', 'org-1')` — the scope-first form is just stylistic.

---

## Metadata

Attach arbitrary data via `meta()`. Ignored during evaluation — for application code like admin dashboards, audit logs, and UI labels:

```typescript
const role = defineRole('beta-tester')
  .name('Beta Tester')
  .meta({ createdBy: 'system', tier: 'beta', maxSeats: 10 })
  .grant('read', 'beta-feature')
  .build()

console.log(role.metadata)
// { createdBy: 'system', tier: 'beta', maxSeats: 10 }
```

Metadata round-trips through every adapter — Prisma, Drizzle, Redis, HTTP all preserve it as a JSON column / blob.

---

## Empty permissions

A role with no permissions is valid:

```typescript
const placeholder = defineRole('placeholder').name('Placeholder').build()
// permissions: []
```

`validateRoles()` flags it as a warning. Useful as an inheritance anchor (`others.inherits('placeholder')`) where the placeholder will eventually get permissions.