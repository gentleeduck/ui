## The request side

Every authorization check assembles an `AccessRequest`:

***

## Subject

The entity making the request - usually a user or service account.

```typescript
interface IamRequest.ISubject {
  id: string
  roles: readonly string[]
  scopedRoles?: readonly IamRequest.IScopedRole[]
  attributes: IamPrimitives.Attributes
}
```

A subject carries an `id`, assigned roles, and arbitrary attributes - department, plan tier, clearance level, or whatever the domain requires.

The engine resolves a subject from `subjectId` on every check (cached after the first resolution). You don't construct `Subject` objects directly - pass the ID and the engine handles it.

***

## Resource

The thing being accessed - a post, document, settings page.

```typescript
interface IamRequest.IResource {
  type: string // e.g. "post", "comment", "dashboard.settings"
  id?: string // optional instance ID
  attributes: IamPrimitives.Attributes
}
```

Resource types use **dot-separated hierarchical matching**. A rule targeting `"dashboard"` also matches `"dashboard.users"` and `"dashboard.users.settings"`.

`attributes` carries record-level data: `ownerId`, `status`, `tenantId`, `tags`, etc. This is what enables ABAC checks like `isOwner()` or `resourceAttr('status', 'eq', 'published')`.

***

## Action

A string describing the operation: `"read"`, `"create"`, `"update"`, `"delete"`, or any custom action. Actions support wildcards:

* `"*"` - matches everything
* Custom prefixes - define your own (e.g. `"posts:read"`, `"posts:write"`)

There's nothing magical about the four CRUD verbs - they're convention, not built-in. Pick action names that fit your domain.

***

## Scope

An optional namespace for multi-tenant isolation. With `scope: "org-1"`, only roles and rules matching that scope apply. Any string works - org IDs, workspace slugs, project keys.

See [scoped roles](/duck-iam/core/roles/scoped) for the three scoping mechanisms.

***

## Environment

Request-time context: IP, user agent, timestamp, plus any custom fields conditions need:

```typescript
interface IamRequest.IEnvironment {
  ip?: string
  userAgent?: string
  timestamp?: number
  [key: string]: IamPrimitives.AttributeValue | undefined // custom fields
}
```

The server middleware integrations (Express, Hono, Nest, Next) build a default `IamRequest.IEnvironment` from request headers. Add custom fields like `region`, `dayOfWeek`, `maintenanceMode`, etc. for time/geo/feature-flag rules.

***

## AccessRequest

The full context for an authorization check:

```typescript
interface IamRequest.IAccessRequest {
  subject: IamRequest.ISubject
  action: string
  resource: IamRequest.IResource
  scope?: string
  environment?: IamRequest.IEnvironment
}
```

`engine.can()` and `engine.check()` build this object internally - you supply the parts. `engine.authorize()` accepts a pre-built `IamRequest.IAccessRequest` directly for advanced use.

***

## Decision

The output of an authorization check (in development mode):

```typescript
interface AccessControl.IDecision {
  allowed: boolean // the boolean you need
  effect: 'allow' | 'deny'
  rule?: AccessControl.IRule // which rule decided
  policy?: string // which policy it came from
  reason: string // human-readable explanation
  duration: number // evaluation time in ms
  timestamp: number // when the check happened
}
```

In **production mode**, `engine.authorize()` returns a plain `boolean` - no `AccessControl.IDecision` allocation. `engine.can()` always returns boolean regardless of mode (it's the simple-API method).

***

## Policy

A named collection of rules with a combining algorithm:

```typescript
interface AccessControl.IPolicy {
  id: string
  name: string
  description?: string
  version?: number
  algorithm: AccessControl.CombiningAlgorithm // 'deny-overrides' | 'allow-overrides' | 'first-match' | 'highest-priority'
  rules: readonly AccessControl.IRule[]
  targets?: {
    actions?: readonly string[]
    resources?: readonly string[]
    roles?: readonly string[]
  }
}
```

See [policies](/duck-iam/core/policies) for the full builder API and combining algorithm details.

***

## Rule

A single authorization statement inside a policy:

```typescript
interface AccessControl.IRule {
  id: string
  effect: AccessControl.Effect // 'allow' | 'deny'
  description?: string
  priority: number
  actions: readonly string[]
  resources: readonly string[]
  conditions: AccessControl.IConditionGroup
  metadata?: Readonly<IamPrimitives.Attributes>
}
```

A rule fires when the action matches, the resource matches, and all conditions pass. See [rule matching](/duck-iam/core/rule-matching) for the match flow.

***

## Condition and ConditionGroup

A single condition checks one field against one value:

```typescript
interface AccessControl.ICondition {
  field: string // e.g. "subject.attributes.department"
  operator: AccessControl.Operator // e.g. "eq", "in", "contains"
  value?: IamPrimitives.AttributeValue
}
```

Conditions are grouped using logical operators:

```typescript
type AccessControl.IConditionGroup =
  | { all: Array<AccessControl.ICondition | AccessControl.IConditionGroup> } // AND
  | { any: Array<AccessControl.ICondition | AccessControl.IConditionGroup> } // OR
  | { none: Array<AccessControl.ICondition | AccessControl.IConditionGroup> } // NOT (none must be true)
```

Groups nest up to 10 levels. Past that, evaluation returns `false` (fail closed).

See [conditions](/duck-iam/core/policies/conditions) and [nesting](/duck-iam/core/policies/nesting) for the full builder.