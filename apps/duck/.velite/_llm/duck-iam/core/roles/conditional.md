## grantWhen

`grantWhen()` attaches conditions to a permission:

```typescript
const author = defineRole('author')
  .name('Author')
  .grant('create', 'post')
  .grant('read', 'post')
  .grantWhen('update', 'post', (w) => w.isOwner())
  .grantWhen('delete', 'post', (w) => w.isOwner())
  .build()
```

Authors can create and read any post, but only update or delete posts they own. `isOwner()` produces `resource.attributes.ownerId eq $subject.id`. `$subject.id` is a [variable reference](/docs/duck-iam/core/policies/dollar-variables) resolved at evaluation time.

  **Per-resource narrowing:** When using `createAccessConfig()` with a typed `context`
  and `resourceAttributes`, calling `.grantWhen('update', 'post', w => ...)` narrows
  `w.resourceAttr()` to only attributes defined for posts. See the
  [type-safe roles](/docs/duck-iam/core/roles/type-safe) docs.

---

## Complex conditional permissions

The `grantWhen()` callback gets a full [`When` builder](/docs/duck-iam/core/policies/conditions):

```typescript
const teamLead = defineRole('team-lead')
  .name('Team Lead')
  .grant('read', 'report')
  .grantWhen('approve', 'expense', (w) =>
    w
      .attr('department', 'eq', 'engineering')
      .resourceAttr('amount', 'lte', 10000),
  )
  .build()
```

This grants `approve` on expenses only when the subject is in engineering AND the amount is at most 10,000.

---

## Combining grantWhen with scope

Both stack — the resulting condition is `(scope match) AND (your when conditions)`:

```typescript
const orgApprover = defineRole('org-approver')
  .scope('org-1')
  .grantWhen('approve', 'expense', (w) => w.resourceAttr('amount', 'lte', 10000))
  .build()
```

Effective rule: only fires when scope is `org-1` AND amount ≤ 10,000.

---

## When to use grantWhen vs. a standalone policy

Quick decision:

| Situation | Use |
| --- | --- |
| Condition belongs to one role's natural meaning | `grantWhen()` on the role |
| Condition spans many roles | Standalone policy |
| Global deny layer | Standalone policy |
| Different combining algorithm or operational lifecycle | Standalone policy |

Examples:

- "Authors can edit their own posts" — `grantWhen('update', 'post', w => w.isOwner())` on the `author` role
- "Block all writes during maintenance mode" — standalone policy with `target({ actions: [...] })`
- "Require GDPR consent for any user-profile read" — standalone policy targeting `user-profile` resource

---

## How grantWhen interacts with role inheritance

Conditional permissions are inherited like any other. If `author` has `grantWhen('update', 'post', isOwner)` and `editor` inherits `author`, the editor also has the conditional update permission.

You can override by re-granting unconditionally:

```typescript
const editor = defineRole('editor')
  .inherits('author')
  .grant('update', 'post') // unconditional — wins under allow-overrides
  .build()
```

Both rules end up in the synthetic RBAC policy. Under `allow-overrides`, the unconditional rule grants access regardless of ownership. Under `deny-overrides` cross-policy, an explicit deny elsewhere can still block.

---

## Built-in shortcuts vs. condition builders

`grantWhen()` accepts a callback for full control. For very common patterns, use a shortcut directly:

```typescript
// Shortcut form:
.grantWhen('update', 'post', (w) => w.isOwner())

// Equivalent explicit form:
.grantWhen('update', 'post', (w) =>
  w.check('resource.attributes.ownerId', 'eq', '$subject.id'),
)
```

See [conditions](/docs/duck-iam/core/policies/conditions) for the full operator reference and [`$`-variables](/docs/duck-iam/core/policies/dollar-variables) for cross-field comparisons.