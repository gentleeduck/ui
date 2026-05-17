## policy()

Build policies with `policy()`:

```typescript
import { policy } from '@gentleduck/iam'

const weekendDeny = policy('deny-weekends')
  .name('Deny on Weekends')
  .desc('Block all write operations on weekends')
  .version(1)
  .algorithm('deny-overrides')
  .rule('r-deny-weekends', (r) =>
    r
      .deny()
      .on('create', 'update', 'delete')
      .of('*')
      .when((w) => w.env('dayOfWeek', 'in', [0, 6])),
  )
  .build()
```

### Builder methods

| Method | Description |
| --- | --- |
| `name(n)` | Human-readable name for the policy |
| `desc(d)` | Optional description |
| `version(v)` | Version number for tracking changes |
| `algorithm(a)` | Combining algorithm - see [combining algorithms](/duck-iam/core/policies/combining-algorithms) |
| `target(t)` | Scope the policy to specific actions, resources, or roles - see [policy targets](/duck-iam/core/policies/targets) |
| `rule(id, fn)` | Add a rule using an inline builder |
| `addRule(rule)` | Add a pre-built `Rule` object |
| `build()` | Produce the final `Policy` object |

***

## Inline rules

Define rules inline within a policy:

```typescript
const myPolicy = policy('content-policy')
  .name('Content Policy')
  .algorithm('deny-overrides')
  .rule('allow-read', (r) => r.allow().on('read').of('post', 'comment'))
  .rule('owner-edit', (r) =>
    r
      .allow()
      .on('update', 'delete')
      .of('post')
      .when((w) => w.isOwner()),
  )
  .rule('block-banned', (r) =>
    r
      .deny()
      .on('*')
      .of('*')
      .when((w) => w.attr('status', 'eq', 'banned')),
  )
  .build()
```

***

## Standalone rules with defineRule

Use `defineRule()` to author rules independently and attach them to multiple policies:

```typescript
import { defineRule } from '@gentleduck/iam'

const ownerOnly = defineRule('owner-only')
  .allow()
  .on('update', 'delete')
  .of('post')
  .priority(20)
  .when((w) => w.isOwner())
  .build()

const maintenanceDeny = defineRule('maintenance-deny')
  .deny()
  .on('create', 'update', 'delete')
  .of('*')
  .priority(100)
  .when((w) => w.env('maintenanceMode', 'eq', true))
  .build()

const myPolicy = policy('my-policy')
  .name('My Policy')
  .algorithm('highest-priority')
  .addRule(ownerOnly)
  .addRule(maintenanceDeny)
  .build()
```

See [rules](/duck-iam/core/policies/rules) for the full rule builder API.

***

## Wildcards

Both actions and resources support wildcards:

```typescript
// All actions on all resources
r.on('*').of('*')

// All actions on posts
r.on('*').of('post')

// Read all resources
r.on('read').of('*')
```

***

## Hierarchical resource matching

Resources also support hierarchical matching. A rule targeting `"dashboard"` matches requests for `"dashboard.users"` and `"dashboard.users.settings"`:

```typescript
.rule('dashboard-read', r => r
  .allow()
  .on('read')
  .of('dashboard')  // matches "dashboard", "dashboard.users", "dashboard.users.settings"
)
```

Hierarchical matching applies to **rule resources only**. Policy targets use direct matching - see [policy targets](/duck-iam/core/policies/targets).