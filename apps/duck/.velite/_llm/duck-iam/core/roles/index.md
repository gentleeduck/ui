## What roles do

Roles are the RBAC side of duck-iam. Build them with `defineRole()`, granting permissions as action/resource pairs. At evaluation time, roles convert to ABAC policies and run through the same engine as hand-written ones.

```typescript
import { defineRole } from '@gentleduck/iam'

const viewer = defineRole('viewer')
  .name('Viewer')
  .desc('Read-only access to published content')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()
```

`defineRole()` returns a `RoleBuilder`. `.build()` produces the plain `Role` object.

---

## Reading order

| Page | Covers |
| --- | --- |
| [definition](/docs/duck-iam/core/roles/definition) | `defineRole()`, `grant()`, shorthand methods, `meta()` |
| [inheritance](/docs/duck-iam/core/roles/inheritance) | `inherits()`, multi-parent, cycle handling, depth |
| [scoped roles](/docs/duck-iam/core/roles/scoped) | Multi-tenancy — role-level scope, permission-level scope, scoped assignments |
| [conditional permissions](/docs/duck-iam/core/roles/conditional) | `grantWhen()` — attribute-aware grants on roles |
| [type-safe roles](/docs/duck-iam/core/roles/type-safe) | `createAccessConfig()` constraints, validation, edge cases |
| [rolesToPolicy](/docs/duck-iam/core/roles/roles-to-policy) | How roles become an ABAC policy under the hood |

---

## Role object structure

```typescript
interface Role {
  id: string
  name: string
  description?: string
  permissions: readonly Permission[]
  inherits?: readonly string[]
  scope?: string
  metadata?: Record<string, AttributeValue>
}

interface Permission {
  action: string | '*'
  resource: string | '*'
  scope?: string | '*'
  conditions?: ConditionGroup
}
```

Each permission is an action/resource pair with optional scope and conditions. Roles are stored as plain JSON in the adapter — no runtime classes.

---

## How roles fit in

The engine doesn't have a separate "RBAC" path. It calls `rolesToPolicy()` to turn role definitions into one synthetic ABAC policy with `id: '__rbac__'`, then evaluates that alongside your custom policies. See [rolesToPolicy](/docs/duck-iam/core/roles/roles-to-policy) for the conversion details.