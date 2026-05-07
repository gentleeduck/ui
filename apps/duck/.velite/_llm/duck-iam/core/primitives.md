## The request side

Every authorization check assembles an `AccessRequest`:

---

## Subject

The entity making the request — usually a user or service account.

```typescript
interface Subject {
  id: string
  roles: readonly string[]
  scopedRoles?: readonly ScopedRole[]
  attributes: Record<string, AttributeValue>
}
```

A subject carries an `id`, assigned roles, and arbitrary attributes — department, plan tier, clearance level, or whatever the domain requires.

The engine resolves a subject from `subjectId` on every check (cached after the first resolution). You don't construct `Subject` objects directly — pass the ID and the engine handles it.

---

## Resource

The thing being accessed — a post, document, settings page.

```typescript
interface Resource {
  type: string // e.g. "post", "comment", "dashboard.settings"
  id?: string // optional instance ID
  attributes: Record<string, AttributeValue>
}
```

Resource types use **dot-separated hierarchical matching**. A rule targeting `"dashboard"` also matches `"dashboard.users"` and `"dashboard.users.settings"`.

`attributes` carries record-level data: `ownerId`, `status`, `tenantId`, `tags`, etc. This is what enables ABAC checks like `isOwner()` or `resourceAttr('status', 'eq', 'published')`.

---

## Action

A string describing the operation: `"read"`, `"create"`, `"update"`, `"delete"`, or any custom action. Actions support wildcards:

- `"*"` — matches everything
- Custom prefixes — define your own (e.g. `"posts:read"`, `"posts:write"`)

There's nothing magical about the four CRUD verbs — they're convention, not built-in. Pick action names that fit your domain.

---

## Scope

An optional namespace for multi-tenant isolation. With `scope: "org-1"`, only roles and rules matching that scope apply. Any string works — org IDs, workspace slugs, project keys.

See [scoped roles](/docs/duck-iam/core/roles/scoped) for the three scoping mechanisms.

---

## Environment

Request-time context: IP, user agent, timestamp, plus any custom fields conditions need:

```typescript
interface Environment {
  ip?: string
  userAgent?: string
  timestamp?: number
  [key: string]: AttributeValue | undefined // custom fields
}
```

The server middleware integrations (Express, Hono, Nest, Next) build a default `Environment` from request headers. Add custom fields like `region`, `dayOfWeek`, `maintenanceMode`, etc. for time/geo/feature-flag rules.

---

## AccessRequest

The full context for an authorization check:

```typescript
interface AccessRequest {
  subject: Subject
  action: string
  resource: Resource
  scope?: string
  environment?: Environment
}
```

`engine.can()` and `engine.check()` build this object internally — you supply the parts. `engine.authorize()` accepts a pre-built `AccessRequest` directly for advanced use.

---

## Decision

The output of an authorization check (in development mode):

```typescript
interface Decision {
  allowed: boolean // the boolean you need
  effect: 'allow' | 'deny'
  rule?: Rule // which rule decided
  policy?: string // which policy it came from
  reason: string // human-readable explanation
  duration: number // evaluation time in ms
  timestamp: number // when the check happened
}
```

In **production mode**, `engine.authorize()` returns a plain `boolean` — no `Decision` allocation. `engine.can()` always returns boolean regardless of mode (it's the simple-API method).

---

## Policy

A named collection of rules with a combining algorithm:

```typescript
interface Policy {
  id: string
  name: string
  description?: string
  version?: number
  algorithm: CombiningAlgorithm // 'deny-overrides' | 'allow-overrides' | 'first-match' | 'highest-priority'
  rules: readonly Rule[]
  targets?: {
    actions?: readonly string[]
    resources?: readonly string[]
    roles?: readonly string[]
  }
}
```

See [policies](/docs/duck-iam/core/policies) for the full builder API and combining algorithm details.

---

## Rule

A single authorization statement inside a policy:

```typescript
interface Rule {
  id: string
  effect: 'allow' | 'deny'
  description?: string
  priority: number
  actions: readonly string[]
  resources: readonly string[]
  conditions: ConditionGroup
}
```

A rule fires when the action matches, the resource matches, and all conditions pass. See [rule matching](/docs/duck-iam/core/rule-matching) for the match flow.

---

## Condition and ConditionGroup

A single condition checks one field against one value:

```typescript
interface Condition {
  field: string // e.g. "subject.attributes.department"
  operator: Operator // e.g. "eq", "in", "contains"
  value?: AttributeValue
}
```

Conditions are grouped using logical operators:

```typescript
type ConditionGroup =
  | { all: Array<Condition | ConditionGroup> } // AND
  | { any: Array<Condition | ConditionGroup> } // OR
  | { none: Array<Condition | ConditionGroup> } // NOT (none must be true)
```

Groups nest up to 10 levels. Past that, evaluation returns `false` (fail closed).

See [conditions](/docs/duck-iam/core/policies/conditions) and [nesting](/docs/duck-iam/core/policies/nesting) for the full builder.