## What targets do

Targets scope a whole policy to specific actions, resources, or roles. A request that doesn't match the targets **skips the policy's rules entirely**.

---

## Setting targets

```typescript
const adminPolicy = policy('admin-only')
  .name('Admin-Only Policy')
  .target({
    roles: ['admin', 'super-admin'],
  })
  .algorithm('deny-overrides')
  .rule('allow-admin-all', (r) => r.allow().on('*').of('*'))
  .build()

// This policy is only evaluated for subjects with admin or super-admin role.
// For everyone else, its rules are not evaluated.
```

---

## Target fields

| Field | Description |
| --- | --- |
| `actions` | Only evaluate if the request action matches one of these |
| `resources` | Only evaluate if the request resource matches one of these |
| `roles` | Only evaluate if the subject has one of these roles |

Every field is optional — unset fields match everything. Set fields combine with **AND**.

---

## Direct vs hierarchical matching

`targets.resources` uses **direct** matching, not the hierarchical matcher used by rule resources. A target of `"dashboard"` doesn't match `"dashboard.users"` unless you also list `"dashboard.users"` or use a wildcard at the rule layer.

For hierarchical matching, see [building policies](/docs/duck-iam/core/policies/building#hierarchical-resource-matching).

---

## Combining targets

```typescript
const writePolicy = policy('write-restrictions')
  .name('Write Restrictions')
  .target({
    actions: ['create', 'update', 'delete'],
    resources: ['post', 'comment'],
  })
  .algorithm('deny-overrides')
  .rule('business-hours', (r) =>
    r
      .deny()
      .on('*')
      .of('*')
      .when((w) =>
        w.or((w) => w.env('hour', 'lt', 9).env('hour', 'gte', 17)),
      ),
  )
  .build()

// Only applies to write operations on posts and comments.
// Read operations and other resource types are not affected.
```

---

## Target mismatch behavior

When a policy is skipped on target mismatch, the engine uses `defaultEffect` for **that policy's contribution**. To make a policy conditional without penalty:

- Scope its targets so it only applies when relevant
- Ensure another policy allows the request when this one is skipped

```typescript
// Conditional restriction — when targets don't match, falls through to defaultEffect.
// If defaultEffect is 'deny', a target mismatch denies. To avoid:
//   - Set engine defaultEffect: 'allow', OR
//   - Add a separate baseline-allow policy

const restriction = policy('weekend-block')
  .target({ actions: ['create', 'update', 'delete'] })  // skipped for reads
  .rule('deny-weekends', (r) =>
    r.deny().on('*').of('*').when((w) => w.env('dayOfWeek', 'in', [0, 6])),
  )
  .build()
```

---

## When to use targets vs. rule conditions

| Situation | Use |
| --- | --- |
| Policy applies to specific roles only | Target `roles` |
| Policy only matters for write operations | Target `actions` |
| Policy is resource-type-specific | Target `resources` |
| Filtering depends on attributes / context | Rule conditions |

Targets are a **fast pre-filter** — the engine skips the entire policy before inspecting individual rules. This makes large policy sets cheaper to evaluate and easier to reason about. Use targets for broad preconditions; use conditions for fine-grained logic.