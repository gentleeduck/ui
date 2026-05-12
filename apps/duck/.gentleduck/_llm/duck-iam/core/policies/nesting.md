## Default is AND

The `When` builder defaults to AND. Top-level conditions all combine with AND:

```typescript
.when((w) => w
  .attr('department', 'eq', 'engineering')
  .attr('level', 'gte', 5)
)
// Both must be true
```

Use `and()`, `or()`, and `not()` for nested groups.

***

## Group types

***

## OR — any condition must be true

```typescript
.when((w) => w
  .or((w) => w
    .role('admin')
    .isOwner(),
  ),
)
// Allowed if the subject is an admin OR the owner
```

***

## AND — all conditions must be true (explicit nesting)

```typescript
.when((w) => w
  .and((w) => w
    .attr('department', 'eq', 'engineering')
    .attr('level', 'gte', 5),
  ),
)
// Allowed if subject is in engineering AND level >= 5
```

Top-level conditions are already AND'd, so `.and(...)` is mainly useful inside other groups for clarity.

***

## NOT — none of the conditions must be true

```typescript
.when((w) => w
  .not((w) => w
    .attr('status', 'eq', 'banned')
    .attr('status', 'eq', 'suspended'),
  ),
)
// Allowed if subject is NOT banned AND NOT suspended
```

`not()` is `none` semantics — every child must be false.

***

## Composing nested groups

```typescript
const complexRule = defineRule('complex-access')
  .allow()
  .on('update')
  .of('post')
  .when((w) => w
    // Must not be banned
    .not((w) => w.attr('status', 'eq', 'banned'))
    // AND must satisfy one of these
    .or((w) => w
      .role('admin')
      .and((w) => w
        .isOwner()
        .resourceAttr('status', 'neq', 'locked'),
      ),
    ),
  )
  .build()

// Logic: NOT banned AND (admin OR (owner AND post not locked))
```

Evaluation tree:

***

## Depth limit

Nesting caps at **10 levels**. Past that the condition evaluates to `false` (fail closed). This protects against accidental infinite recursion or stack overflow from generated rules.

If you genuinely need more than 10 levels of nesting, refactor — split logic into separate policies and let the [combining algorithm](/docs/duck-iam/core/policies/combining-algorithms) compose them.

***

## Empty condition groups

Empty arrays follow standard logic:

| Group | Semantics |
| --- | --- |
| `{ all: [] }` | `true` (vacuous truth: zero conditions all satisfied) |
| `{ any: [] }` | `false` (no conditions to satisfy) |
| `{ none: [] }` | `true` (no conditions violated) |

This matches mathematical logic and SQL conventions. An empty `when()` block is equivalent to no `when()` at all — the rule matches unconditionally.

***

## whenAny for top-level OR

`whenAny()` makes the top level OR instead of AND:

```typescript
const rule = defineRule('flexible-access')
  .allow()
  .on('read')
  .of('post')
  .whenAny((w) => w
    .resourceAttr('visibility', 'eq', 'public')
    .role('admin')
    .isOwner(),
  )
  .build()

// Allowed if the post is public OR subject is admin OR subject is owner
```

Use `whenAny()` when the **whole rule** is one top-level OR expression. Use nested `.or()` groups when the OR logic is only one branch inside a larger AND-shaped rule. The difference is mostly readability.