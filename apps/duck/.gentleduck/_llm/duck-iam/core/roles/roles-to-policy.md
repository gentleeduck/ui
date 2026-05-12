## What rolesToPolicy does

`rolesToPolicy()` turns role definitions into one ABAC policy. The engine calls this internally — you almost never invoke it directly, but understanding the conversion helps debug evaluation behavior.

For each role, the function:

1. **Flattens** the inheritance chain into all permissions (own and inherited)
2. **Creates a Rule per permission** with:
   * `effect: 'allow'`
   * `actions` and `resources` from the permission
   * `subject.roles contains "<roleId>"` as a condition
   * `scope eq "<scope>"` when the permission or role is scoped
   * Any conditions from `grantWhen()`
   * `priority: 10` (default)
3. **Wraps** the rules in a policy with `id: '__rbac__'` and `algorithm: 'allow-overrides'`

***

## Example conversion

The viewer role:

```typescript
const viewer = defineRole('viewer')
  .name('Viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()
```

Becomes:

```typescript
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

***

## Why allow-overrides?

`allow-overrides` means **any role granting the permission is enough**. A user with multiple roles gets the union of their permissions.

```typescript
// User has both roles:
await engine.admin.assignRole('user-1', 'viewer')
await engine.admin.assignRole('user-1', 'commenter')

// Either role granting an action is enough — union, not intersection
```

This is the natural RBAC contract — adding a role only grants more access, never restricts it.

To restrict access, use a separate policy with `deny-overrides` semantics. The engine cross-policy AND-combines, so a deny in any policy wins regardless of how many allow rules fire in `__rbac__`.

***

## Cached and rebuilt on role changes

The engine caches the result of `rolesToPolicy()` to avoid recomputing on every check. The cache is invalidated automatically when:

* `engine.admin.saveRole()` is called
* `engine.admin.deleteRole()` is called
* `engine.invalidateRoles()` is called manually
* The role-load TTL expires (configurable via `cacheTTL`)

In production, this means role evaluations hit a hot in-process cache, not the adapter. See [engine caching](/docs/duck-iam/advanced/engine).

***

## Calling it manually

You normally don't, but the function is exported if you need it:

```typescript
import { rolesToPolicy } from '@gentleduck/iam'

const rbacPolicy = rolesToPolicy([viewer, editor, admin])
console.log(rbacPolicy.rules.length) // total rules generated
```

Useful for:

* Inspecting generated rules during debugging
* Testing without spinning up an engine
* Pre-computing policies in build steps for very large role sets

The output is just data — pure JSON, no engine reference.

***

## Why the inflated rule count?

A role hierarchy with N roles each granting M permissions produces up to N × M rules in `__rbac__` (worst case, with deep inheritance). This is intentional:

* Each rule is gated by `subject.roles contains "<roleId>"` so the engine can skip irrelevant rules in O(1) via the precomputed index
* Inherited permissions are flattened (not chained at eval time) so each role's effective permissions are independently checkable
* The cost is policy-load time only, not per-evaluation — caching makes this cheap

For very large role sets (1000+ roles, 10+ permissions each), monitor the policy-load time. The fast-path evaluator (`evaluatePolicyFast`) handles 10k+ rules with sub-microsecond lookups in the precomputed map.