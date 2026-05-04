## When to Use Policies

Roles cover the common case: "editors can update posts." Some requirements need more
than roles can express:

- **Time-based restrictions**: deny writes on weekends or outside business hours.
- **IP/geo-fencing**: allow access only from trusted networks.
- **Cross-attribute checks**: allow updates only when subject and resource share a
  department.
- **Dynamic deny rules**: block specific users or flag suspicious behavior without
  changing role assignments.
- **Maintenance mode**: deny all writes globally when a feature flag is on.

ABAC policies share the role evaluation pipeline. The engine AND-combines policies —
a deny from any policy is final.

## Building Policies

Build policies with `policy()`:

```typescript

const weekendDeny = policy('deny-weekends')
  .name('Deny on Weekends')
  .desc('Block all write operations on weekends')
  .version(1)
  .algorithm('deny-overrides')
  .rule('r-deny-weekends', r => r
    .deny()
    .on('create', 'update', 'delete')
    .of('*')
    .when(w => w.env('dayOfWeek', 'in', [0, 6]))
  )
  .build()
```

### Policy builder methods

| Method | Description |
| --- | --- |
| `name(n)` | Human-readable name for the policy. |
| `desc(d)` | Optional description. |
| `version(v)` | Version number for tracking changes. |
| `algorithm(a)` | Combining algorithm: `'deny-overrides'`, `'allow-overrides'`, `'first-match'`, `'highest-priority'`. Defaults to `'deny-overrides'`. |
| `target(t)` | Scope the policy to specific actions, resources, or roles. |
| `rule(id, fn)` | Add a rule using an inline builder. |
| `addRule(rule)` | Add a pre-built `Rule` object. |
| `build()` | Produce the final `Policy` object. |

## Building Rules

Rules are the statements inside a policy. Each rule has an effect (allow or deny), the
actions and resources it covers, a priority, and conditions.

### Inline rules

Define rules inline within a policy:

```typescript
const myPolicy = policy('content-policy')
  .name('Content Policy')
  .algorithm('deny-overrides')
  .rule('allow-read', r => r
    .allow()
    .on('read')
    .of('post', 'comment')
  )
  .rule('owner-edit', r => r
    .allow()
    .on('update', 'delete')
    .of('post')
    .when(w => w.isOwner())
  )
  .rule('block-banned', r => r
    .deny()
    .on('*')
    .of('*')
    .when(w => w.attr('status', 'eq', 'banned'))
  )
  .build()
```

### Standalone rules with defineRule

```typescript

const ownerOnly = defineRule('owner-only')
  .allow()
  .on('update', 'delete')
  .of('post')
  .priority(20)
  .when(w => w.isOwner())
  .build()

const maintenanceDeny = defineRule('maintenance-deny')
  .deny()
  .on('create', 'update', 'delete')
  .of('*')
  .priority(100)
  .when(w => w.env('maintenanceMode', 'eq', true))
  .build()

const myPolicy = policy('my-policy')
  .name('My Policy')
  .algorithm('highest-priority')
  .addRule(ownerOnly)
  .addRule(maintenanceDeny)
  .build()
```

### Rule builder methods

| Method | Description |
| --- | --- |
| `allow()` | Set the effect to `allow`. This is the default. |
| `deny()` | Set the effect to `deny`. |
| `on(...actions)` | Actions this rule applies to. Defaults to `['*']`. |
| `of(...resources)` | Resources this rule applies to. Defaults to `['*']`. |
| `priority(p)` | Numeric priority. Higher values win with `highest-priority` algorithm. Defaults to `10`. |
| `desc(d)` | Optional description. |
| `when(fn)` | Conditions that must ALL be true (AND logic). |
| `whenAny(fn)` | Conditions where ANY can be true (OR logic). |
| `forScope(...scopes)` | Restrict this rule to specific scopes. Composes with `when()`. |
| `meta(m)` | Arbitrary metadata. |
| `build()` | Produce the final `Rule` object. |

### Wildcards

Both actions and resources support wildcards:

```typescript
// All actions on all resources
r.on('*').of('*')

// All actions on posts
r.on('*').of('post')

// Read all resources
r.on('read').of('*')
```

Resources also support hierarchical matching. A rule targeting `"dashboard"` matches
requests for `"dashboard.users"` and `"dashboard.users.settings"`. Hierarchical matching
applies to rule resources only. Policy targets use direct matching.

## Conditions: The When Builder

The `When` builder defines conditions for rules (and for `grantWhen()` on roles).
Conditions added to a `When` builder combine with AND.

### Raw condition check

`check(field, operator, value)` is the general form:

```typescript
.when(w => w
  .check('subject.attributes.age', 'gte', 18)
  .check('resource.attributes.rating', 'neq', 'restricted')
)
```

### Shorthand operator methods

```typescript
.when(w => w
  .eq('subject.id', 'user-1')           // field == value
  .neq('resource.attributes.status', 'archived')  // field != value
  .gt('subject.attributes.age', 18)     // field > value
  .gte('subject.attributes.level', 5)   // field >= value
  .lt('resource.attributes.price', 100) // field < value
  .lte('subject.attributes.risk', 3)    // field <= value
  .in('subject.attributes.role', ['admin', 'editor'])  // field in [values]
  .contains('subject.roles', 'admin')   // array contains value / string contains substring
  .exists('resource.attributes.ownerId')  // field is not null/undefined
  .matches('resource.attributes.email', '^.*@company\\.com$')  // regex match
)
```

### Semantic shortcuts

```typescript
.when(w => w
  // Role checks
  .role('admin')                 // subject.roles contains "admin"
  .roles('admin', 'editor')     // subject.roles in ["admin", "editor"]

  // Scope checks
  .scope('org-1')               // scope eq "org-1"
  .scopes('org-1', 'org-2')    // scope in ["org-1", "org-2"]

  // Ownership check
  .isOwner()                    // resource.attributes.ownerId eq $subject.id
  .isOwner('resource.attributes.createdBy')  // custom owner field

  // Resource type check
  .resourceType('post', 'comment')  // resource.type in ["post", "comment"]

  // Attribute shortcuts
  .attr('department', 'eq', 'engineering')        // subject.attributes.department eq "engineering"
  .resourceAttr('status', 'eq', 'published')      // resource.attributes.status eq "published"
  .env('ip', 'eq', '10.0.0.1')                   // environment.ip eq "10.0.0.1"
)
```

  **Typed dot-paths:** By default, `.attr()`, `.resourceAttr()`, `.env()`, and `.check()`
  accept any string. Pass a `context` phantom field to `createAccessConfig()` to get full
  autocompletion and type-checked values. See the
  [type-safe config](/duck-iam/advanced/config#typed-context-for-dot-path-intellisense) docs.

## All Condition Operators

| Operator | Description | Example |
| --- | --- | --- |
| `eq` | Strict equality (`===`) | `w.eq('subject.id', 'user-1')` |
| `neq` | Strict inequality (`!==`) | `w.neq('resource.attributes.status', 'deleted')` |
| `gt` | Greater than (numbers only) | `w.gt('subject.attributes.age', 18)` |
| `gte` | Greater than or equal (numbers only) | `w.gte('resource.attributes.priority', 5)` |
| `lt` | Less than (numbers only) | `w.lt('resource.attributes.price', 1000)` |
| `lte` | Less than or equal (numbers only) | `w.lte('subject.attributes.riskScore', 3)` |
| `in` | Value is in the given array. If field is an array, checks if any element overlaps. | `w.in('subject.attributes.tier', ['pro', 'enterprise'])` |
| `nin` | Value is NOT in the given array. | `w.check('subject.attributes.status', 'nin', ['banned', 'suspended'])` |
| `contains` | Array contains the value, or string contains the substring. | `w.contains('subject.roles', 'admin')` |
| `not_contains` | Array does NOT contain the value, or string does NOT contain the substring. | `w.check('subject.attributes.tags', 'not_contains', 'blocked')` |
| `starts_with` | String starts with the given prefix. | `w.check('resource.attributes.path', 'starts_with', '/admin')` |
| `ends_with` | String ends with the given suffix. | `w.check('resource.attributes.email', 'ends_with', '@company.com')` |
| `matches` | String matches a regular expression. Patterns longer than 512 characters return `false` (ReDoS protection). Invalid regex patterns return `false`. Patterns are cached in a 256-entry LRU for performance. | `w.matches('resource.attributes.slug', '^[a-z0-9-]+$')` |
| `exists` | Field is not null and not undefined. The `value` parameter is ignored. | `w.exists('resource.attributes.publishedAt')` |
| `not_exists` | Field is null or undefined. The `value` parameter is ignored. | `w.check('resource.attributes.deletedAt', 'not_exists')` |
| `subset_of` | Every element in the field array exists in the value array. Both must be arrays. | `w.check('subject.attributes.permissions', 'subset_of', ['read', 'write', 'admin'])` |
| `superset_of` | Every element in the value array exists in the field array. Both must be arrays. | `w.check('subject.roles', 'superset_of', ['viewer', 'commenter'])` |

### Operator edge cases

- **Numeric operators** (`gt`, `gte`, `lt`, `lte`): field and value must both be numbers.
  Anything else returns `false`.
- **String operators** (`starts_with`, `ends_with`, `matches`): field and value must both
  be strings. Anything else returns `false`.
- **`in` with arrays**: when the field is an array (e.g. `subject.roles`), checks for
  any overlap with the value array. When the field is a scalar, checks membership.
- **`contains` with strings vs arrays**: arrays use `Array.includes()`; strings use
  `String.includes()`. Other types return `false`.
- **`subset_of` / `superset_of`**: field and value must both be arrays. Non-arrays
  return `false`.
- **Missing fields**: a path that resolves to `null` or `undefined` compares against
  `null` for `eq`, `gt`, etc. Use `exists` / `not_exists` to test presence.

## Field Resolution

Conditions reference fields using dot-notation paths resolved against the `AccessRequest`
at evaluation time.

### Supported paths

| Path | Resolves to |
| --- | --- |
| `subject.id` | The subject's ID string. |
| `subject.roles` | The subject's roles array. |
| `subject.attributes.

### OR: any condition must be true

```typescript
.when(w => w
  .or(w => w
    .role('admin')
    .isOwner()
  )
)
// Allowed if the subject is an admin OR the owner
```

### AND: all conditions must be true (explicit nesting)

```typescript
.when(w => w
  .and(w => w
    .attr('department', 'eq', 'engineering')
    .attr('level', 'gte', 5)
  )
)
// Allowed if subject is in engineering AND level >= 5
```

### NOT: none of the conditions must be true

```typescript
.when(w => w
  .not(w => w
    .attr('status', 'eq', 'banned')
    .attr('status', 'eq', 'suspended')
  )
)
// Allowed if subject is NOT banned AND NOT suspended
```

### Composing nested groups

```typescript
const complexRule = defineRule('complex-access')
  .allow()
  .on('update')
  .of('post')
  .when(w => w
    // Must not be banned
    .not(w => w.attr('status', 'eq', 'banned'))
    // AND must satisfy one of these
    .or(w => w
      .role('admin')
      .and(w => w
        .isOwner()
        .resourceAttr('status', 'neq', 'locked')
      )
    )
  )
  .build()

// Logic: NOT banned AND (admin OR (owner AND post not locked))
```

Evaluation tree:

Nesting caps at 10 levels. Past that the condition evaluates to `false` (fail closed).

### Empty condition groups

Empty arrays follow standard logic:

- `{ all: [] }`: `true` (vacuous truth: all zero conditions are satisfied).
- `{ any: [] }`: `false` (no conditions to satisfy).
- `{ none: [] }`: `true` (no conditions violated).

### whenAny for top-level OR

`whenAny()` makes the top level OR instead of AND:

```typescript
const rule = defineRule('flexible-access')
  .allow()
  .on('read')
  .of('post')
  .whenAny(w => w
    .resourceAttr('visibility', 'eq', 'public')
    .role('admin')
    .isOwner()
  )
  .build()

// Allowed if the post is public OR subject is admin OR subject is owner
```

## Policy Targets

Targets scope a whole policy to specific actions, resources, or roles. A request that
doesn't match the targets skips the policy's rules.

```typescript
const adminPolicy = policy('admin-only')
  .name('Admin-Only Policy')
  .target({
    roles: ['admin', 'super-admin'],
  })
  .algorithm('deny-overrides')
  .rule('allow-admin-all', r => r.allow().on('*').of('*'))
  .build()

// This policy is only evaluated for subjects with admin or super-admin role.
// For everyone else, its rules are not evaluated.
```

### Target fields

| Field | Description |
| --- | --- |
| `actions` | Only evaluate this policy if the request action matches one of these. |
| `resources` | Only evaluate this policy if the request resource matches one of these. |
| `roles` | Only evaluate this policy if the subject has one of these roles. |

Every field is optional — unset fields match everything. Set fields combine with AND.

`targets.resources` uses direct matching, not the hierarchical matcher used by rule
resources. A target of `"dashboard"` doesn't match `"dashboard.users"` unless you also
list `"dashboard.users"` or use a wildcard at the rule layer.

```typescript
const writePolicy = policy('write-restrictions')
  .name('Write Restrictions')
  .target({
    actions: ['create', 'update', 'delete'],
    resources: ['post', 'comment'],
  })
  .algorithm('deny-overrides')
  .rule('business-hours', r => r
    .deny()
    .on('*')
    .of('*')
    .when(w => w
      .or(w => w
        .env('hour', 'lt', 9)
        .env('hour', 'gte', 17)
      )
    )
  )
  .build()

// Only applies to write operations on posts and comments.
// Read operations and other resource types are not affected.
```

When a policy is skipped on target mismatch, the engine uses `defaultEffect` for that
policy. To make a policy conditional without penalty, scope its targets and ensure
another policy allows the request.

## Combining Algorithms: Detailed Reference

### deny-overrides

The default and most conservative algorithm. Any deny beats any allow.

```typescript
const p = policy('strict')
  .algorithm('deny-overrides')
  .rule('allow-read', r => r.allow().on('read').of('post'))
  .rule('deny-drafts', r => r
    .deny()
    .on('read')
    .of('post')
    .when(w => w.resourceAttr('status', 'eq', 'draft'))
  )
  .build()
```

Evaluation logic:
1. Find all matching rules.
2. If any has `effect: "deny"`, the policy result is **deny**.
3. Else if any has `effect: "allow"`, the policy result is **allow**.
4. Else fall back to `defaultEffect`.

Use this for restriction policies — a single deny blocks access regardless of how many
allow rules match.

### allow-overrides

The inverse: any allow beats any deny. Used by the auto-generated RBAC policy.

```typescript
const p = policy('permissive')
  .algorithm('allow-overrides')
  .rule('deny-default', r => r.deny().on('*').of('*'))
  .rule('vip-access', r => r
    .allow()
    .on('*')
    .of('premium-content')
    .when(w => w.attr('tier', 'in', ['pro', 'enterprise']))
  )
  .build()
```

Evaluation logic:
1. Find all matching rules.
2. If any has `effect: "allow"`, the policy result is **allow**.
3. Else if any has `effect: "deny"`, the policy result is **deny**.
4. Else fall back to `defaultEffect`.

Use this for deny-by-default policies where specific allow rules grant access.

### first-match

The first matching rule wins. Order matters.

```typescript
const p = policy('firewall')
  .algorithm('first-match')
  .rule('block-bad-ip', r => r
    .deny()
    .on('*')
    .of('*')
    .when(w => w.env('ip', 'in', ['10.0.0.99', '10.0.0.100']))
  )
  .rule('allow-internal', r => r
    .allow()
    .on('*')
    .of('*')
    .when(w => w.env('ip', 'starts_with', '10.'))
  )
  .rule('deny-external', r => r.deny().on('*').of('*'))
  .build()
```

Evaluation logic:
1. Walk rules in order.
2. Collect all matching rules.
3. The first matching rule's effect is the policy result.
4. If none match, fall back to `defaultEffect`.

Use this for firewall-style ordered rule lists.

### highest-priority

The matching rule with the highest `priority` wins.

```typescript
const p = policy('priority')
  .algorithm('highest-priority')
  .rule('normal-allow', r => r
    .allow()
    .on('read')
    .of('post')
    .priority(10)
  )
  .rule('elevated-deny', r => r
    .deny()
    .on('read')
    .of('post')
    .when(w => w.resourceAttr('classification', 'eq', 'top-secret'))
    .priority(50)
  )
  .rule('emergency-override', r => r
    .allow()
    .on('*')
    .of('*')
    .when(w => w.role('super-admin'))
    .priority(100)
  )
  .build()
```

Evaluation logic:
1. Find all matching rules.
2. Sort by `priority` descending.
3. The highest-priority rule's effect is the policy result.
4. If tied, the first encountered among tied rules wins.
5. If none match, fall back to `defaultEffect`.

Use this when rules have clear priority tiers and definition order shouldn't matter.

## Complete Example: Layered Access Control

```typescript

const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete', 'publish'] as const,
  resources: ['post', 'comment', 'user'] as const,
  scopes: ['org-alpha', 'org-beta'] as const,
  roles: ['viewer', 'editor', 'admin'] as const,
})

// --- RBAC: who can do what ---

const viewer = access.defineRole('viewer')
  .name('Viewer')
  .grantRead('post', 'comment')
  .build()

const editor = access.defineRole('editor')
  .name('Editor')
  .inherits('viewer')
  .grantCRUD('post')
  .grant('publish', 'post')
  .grantCRUD('comment')
  .build()

// --- ABAC: additional restrictions ---

const businessHours = access.policy('business-hours')
  .name('Business Hours Only')
  .desc('Deny write operations outside business hours')
  .target({ actions: ['create', 'update', 'delete', 'publish'] })
  .algorithm('first-match')
  .rule('deny-off-hours', r => r
    .deny()
    .on('*')
    .of('*')
    .when(w => w
      .or(w => w
        .env('hour', 'lt', 9)
        .env('hour', 'gte', 17)
      )
    )
  )
  .rule('allow-in-hours', r => r
    .allow()
    .on('*')
    .of('*')
  )
  .build()

const contentSafety = access.policy('content-safety')
  .name('Content Safety')
  .algorithm('deny-overrides')
  .rule('owner-delete-only', r => r
    .deny()
    .on('delete')
    .of('post')
    .when(w => w
      .not(w => w
        .or(w => w
          .isOwner()
          .role('admin')
        )
      )
    )
  )
  .rule('no-banned-users', r => r
    .deny()
    .on('*')
    .of('*')
    .when(w => w.attr('status', 'eq', 'banned'))
  )
  .build()

// --- Wire it up ---

const engine = access.createEngine({
  adapter: myAdapter,
  defaultEffect: 'deny',
})

// Save roles and policies
for (const role of [viewer, editor]) {
  await engine.admin.saveRole(role)
}
for (const pol of [businessHours, contentSafety]) {
  await engine.admin.savePolicy(pol)
}

// Check access
const allowed = await engine.can(
  'user-1',
  'update',
  { type: 'post', id: 'post-42', attributes: { ownerId: 'user-1' } },
  { hour: 14 },  // 2 PM -- within business hours
)
// true: editor role allows update, business hours policy allows, content safety allows
```

The evaluation flow for this request:

1. **RBAC policy** (`allow-overrides`): editor role grants `update` on `post` -> **allow**.
2. **business-hours** (`first-match`): hour is 14, so `deny-off-hours` condition (`hour < 9 OR hour >= 17`) is false, so the rule does not match. Next rule `allow-in-hours` has no conditions, so it matches -> **allow**.
3. **content-safety** (`deny-overrides`): user is not banned (`status` is not `'banned'`), and the `owner-delete-only` rule targets `delete` but the request is `update`, so no deny rules match, no allow rules to fire -> falls through to `defaultEffect`.
4. **Cross-policy AND**: RBAC allows, business-hours allows, content-safety uses default -> all must allow -> **ALLOWED**.

A policy with only deny rules where none match falls through to `defaultEffect`
(usually `"deny"`). To avoid an accidental deny, add an explicit allow rule (as in
the business-hours policy above) or use `first-match` or `allow-overrides` with a
catch-all allow as the last rule.

---

## Policies FAQ

  
    Why does a bad field path not throw an exception?
    
      Field resolution fails closed. Unsupported roots, blocked prototype-like segments, and missing properties
      resolve to <code className="rounded bg-muted px-2 py-1">null</code>, so the condition safely fails instead of
      crashing evaluation.
    
  

  
    Why should I use policy targets instead of only rule conditions?
    
      Targets are a fast pre-filter. They let the engine skip entire policies before it ever inspects individual
      rules or conditions, which keeps large policy sets easier to reason about and cheaper to evaluate.
    
  

  
    Can a policy deny something that a role allows?
    
      Yes. Roles are converted into an allow-oriented RBAC policy, but your custom policies are still evaluated
      alongside it. If a deny rule in another policy matches, the final AND-combined result is deny.
    
  

  
    Why does a target mismatch fall back to the default effect?
    
      A target mismatch means the policy does not apply to the request. duck-iam does not invent a separate
      neutral state for that branch; it continues with the configured default effect for the evaluation path,
      which is why <code className="rounded bg-muted px-2 py-1">deny</code> remains the safest default.
    
  

  
    When should I use whenAny() instead of nesting .or() groups inside when()?
    
      Use <code className="rounded bg-muted px-2 py-1">whenAny()</code> when the whole rule is one top-level OR expression.
      Use nested <code className="rounded bg-muted px-2 py-1">.or()</code> groups when the OR logic is only one branch inside a
      larger AND-shaped rule. The difference is mostly about readability and how clearly the top-level logic is expressed.
    
  

  
    How do I decide between grantWhen() on a role and a standalone policy rule?
    
      Reach for <code className="rounded bg-muted px-2 py-1">grantWhen()</code> when the condition belongs to a single role's
      permission semantics. Reach for a standalone policy when the rule spans many roles, acts as a global deny layer, or needs a
      separate combining algorithm and operational lifecycle.
    
  

  
    Where exactly can I use $-references, and what can they point at?
    
      `$` references are value-side comparisons, so they work in <code className="rounded bg-muted px-2 py-1">check()</code>,
      <code className="rounded bg-muted px-2 py-1">eq()</code>, <code className="rounded bg-muted px-2 py-1">neq()</code>,
      <code className="rounded bg-muted px-2 py-1">attr()</code>, <code className="rounded bg-muted px-2 py-1">resourceAttr()</code>,
      and <code className="rounded bg-muted px-2 py-1">env()</code>. They can point at the same request roots as field paths:
      <code className="rounded bg-muted px-2 py-1">$subject...</code>,
      <code className="rounded bg-muted px-2 py-1">$resource...</code>,
      <code className="rounded bg-muted px-2 py-1">$environment...</code>,
      <code className="rounded bg-muted px-2 py-1">$action</code>, and
      <code className="rounded bg-muted px-2 py-1">$scope</code>.
    
  

  
    How do I write a deny-only policy without accidentally blocking everything?
    
      Be explicit about the policy shape. A deny-only policy paired with a fail-closed default effect can still produce a deny
      when none of its rules match. If the policy is meant to act only as an extra restriction layer, add a catch-all allow rule
      where appropriate or choose a combining strategy that makes the fallback behavior obvious to future readers.
    
  

  
    How do targets, rule action/resource filters, and conditions layer together?
    
      Think of them as concentric filters. Targets decide whether the policy is worth evaluating at all. Rule action/resource
      filters decide which rules are even candidates. Conditions are the final contextual checks on those candidate rules.
      Put broad preconditions in targets, rule-local matching in actions/resources, and contextual logic in conditions.