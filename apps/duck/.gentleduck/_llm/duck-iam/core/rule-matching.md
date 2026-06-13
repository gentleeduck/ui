## Three checks for one fire

Every rule goes through three gates:

All three must pass before the rule's effect (allow or deny) is applied.

***

## 1. Action match

The request's action must be in the rule's `actions` list, or the rule must include `'*'`.

```typescript
// Rule:
r.on('create', 'update').of('post')

// Request action 'create' -> matches
// Request action 'delete' -> no match
```

Wildcards:

```typescript
r.on('*') // matches every action
```

Custom prefix patterns are not specially interpreted - the engine treats them as regular string membership. If you want `posts:*` semantics, list the actions explicitly or implement matching in a condition.

***

## 2. Resource match

Two matching modes depending on whether dots appear in the resource type:

### Direct (no dots)

```typescript
r.of('post', 'comment')

// Request resource 'post'    -> match
// Request resource 'comment' -> match
// Request resource 'user'    -> no match
```

### Hierarchical (with dots)

A rule targeting `"dashboard"` matches requests for `"dashboard"`, `"dashboard.users"`, `"dashboard.users.settings"`:

```typescript
r.of('dashboard')

// Request 'dashboard'                -> match (exact)
// Request 'dashboard.users'          -> match (prefix)
// Request 'dashboard.users.settings' -> match (prefix)
// Request 'admin'                    -> no match
```

A rule targeting `"dashboard.users"` does **not** match a request for the broader `"dashboard"` - hierarchical matching is one-way and prefix-based.

This mode is rule-specific. **Policy targets use direct matching only** - see [policy targets](/duck-iam/core/policies/targets).

### Wildcards

```typescript
r.of('*') // matches every resource type
```

***

## 3. Conditions

If both action and resource match, the rule's `conditions` are evaluated. See [conditions](/duck-iam/core/policies/conditions) for the full operator reference.

The engine has a **fast path** for unconditional rules (empty conditions or `{ all: [] }`) - these are pre-computed at policy load time into a result map, so checking them is an O(1) lookup with no condition traversal.

For conditional rules, the engine evaluates the condition tree against the `IamRequest.IAccessRequest`. Failed conditions cause the rule to be skipped, not the whole policy.

***

## Field resolution

Condition `field` values are dot-notation paths resolved against the `IamRequest.IAccessRequest`.

Top-level paths the engine resolves:

* `subject.id`, `subject.roles`, `subject.attributes.

```typescript
// Does resource.attributes.ownerId equal the subject's ID?
{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }
```

The `$` prefix is stripped and the remainder resolves with the same field paths. See [`$`-variable references](/duck-iam/core/policies/dollar-variables) for builder shortcuts and patterns.

***

## When a rule does NOT fire

Rules silently skip without affecting evaluation. The combining algorithm only sees the rules that **did** fire - non-matches don't count as either allow or deny.

This means a policy with only one rule that fails to match falls through to `defaultEffect`. To prevent accidental denies:

* Use `first-match` with a catch-all allow as the last rule, OR
* Use `allow-overrides` and let `defaultEffect: 'deny'` handle the no-match case explicitly, OR
* Set `engine.defaultEffect: 'allow'` and use deny rules as exceptions

The shape of your combining algorithm + the default effect together determine what "no rule matched" means. See [combining algorithms](/duck-iam/core/policies/combining-algorithms).