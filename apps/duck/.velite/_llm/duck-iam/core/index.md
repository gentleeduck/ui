## How duck-iam Works

duck-iam is a hybrid access control engine. Roles (RBAC) and policies (ABAC) feed the
same evaluation pipeline.

Roles convert to ABAC policies internally. Every check runs through one evaluator —
no separate path for roles vs. hand-written policies.

### RBAC vs ABAC vs duck-iam

## The Evaluation Flow

When you call `engine.can()` or `engine.authorize()`:

### Step by step

1. **Resolve the subject.** Load the user's assigned roles from the adapter, walk
   inheritance chains for the effective set, then merge any scoped roles that match the
   request scope.

2. **Convert roles to policy.** `rolesToPolicy()` turns every role permission into an
   ABAC rule with a `subject.roles contains 

### Subject

The entity making the request — usually a user or service account.

```typescript
interface Subject {
  id: string
  roles: readonly string[]
  scopedRoles?: readonly ScopedRole[]
  attributes: Record

### AccessRequest

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

The `environment` field carries request-time context: IP address, user agent,
timestamp, or any custom key-value pairs needed by conditions.

```typescript
interface Environment {
  ip?: string
  userAgent?: string
  timestamp?: number
  [key: string]: AttributeValue | undefined  // custom fields
}
```

### Policy

A named collection of rules with a combining algorithm:

```typescript
interface Policy {
  id: string
  name: string
  description?: string
  version?: number
  algorithm: CombiningAlgorithm
  rules: readonly Rule[]
  targets?: {
    actions?: readonly string[]
    resources?: readonly string[]
    roles?: readonly string[]
  }
}
```

Policy targets scope a policy to specific actions, resources, or roles. A request that
doesn't match the targets skips the policy's rules.

### Rule

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

A rule fires when the action matches, the resource matches, and all conditions pass.
Its effect (`allow` or `deny`) applies.

### How a Rule is Matched

Three checks must pass before a rule's effect applies:

### Condition and ConditionGroup

A single condition checks one field against one value:

```typescript
interface Condition {
  field: string       // e.g. "subject.attributes.department"
  operator: Operator  // e.g. "eq", "in", "contains"
  value?: AttributeValue
}
```

Conditions are grouped using logical operators:

```typescript
type ConditionGroup =
  | { all: Array

Groups nest up to 10 levels. Past that, evaluation returns `false` (fail closed).

### Field Resolution

Condition `field` values are dot-notation paths resolved against the `AccessRequest`.

Top-level paths the engine resolves:

- `subject.id`, `subject.roles`, `subject.attributes.

```typescript
// Does resource.attributes.ownerId equal the subject's ID?
{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }
```

The `$` prefix is stripped and the remainder resolves with the same field paths.
Common uses: ownership checks (`$subject.id`), department matching
(`$subject.attributes.department`), scope validation (`$scope`).

### Decision

The output of an authorization check:

```typescript
interface Decision {
  allowed: boolean    // the boolean you need
  effect: 'allow' | 'deny'
  rule?: Rule         // which rule decided
  policy?: string     // which policy it came from
  reason: string      // human-readable explanation
  duration: number    // evaluation time in ms
  timestamp: number   // when the check happened
}
```

## Combining Algorithms

Each policy uses a combining algorithm to resolve conflicts when several rules match.

### deny-overrides (default)

Any `deny` beats any `allow`. The safest default.

```typescript
const strictPolicy = policy('strict')
  .algorithm('deny-overrides')
  .rule('allow-read', r => r.allow().on('read').of('post'))
  .rule('block-drafts', r => r
    .deny()
    .on('read')
    .of('post')
    .when(w => w.resourceAttr('status', 'eq', 'draft'))
  )
  .build()

// If both rules match, deny wins -- you cannot read draft posts.
```

### allow-overrides

Any `allow` beats any `deny`. Use for permissive policies where one allow rule is
enough.

```typescript
const permissivePolicy = policy('permissive')
  .algorithm('allow-overrides')
  .rule('deny-default', r => r.deny().on('*').of('*'))
  .rule('admin-override', r => r
    .allow()
    .on('*')
    .of('*')
    .when(w => w.role('admin'))
  )
  .build()

// Admin role triggers the allow rule, which overrides the deny.
```

This is the algorithm the auto-generated RBAC policy uses.

### first-match

The first matching rule wins. Rule order matters.

```typescript
const orderedPolicy = policy('ordered')
  .algorithm('first-match')
  .rule('block-ip', r => r
    .deny()
    .on('*')
    .of('*')
    .when(w => w.env('ip', 'eq', '10.0.0.99'))
  )
  .rule('allow-all', r => r.allow().on('*').of('*'))
  .build()

// The deny rule is checked first. If the IP matches, deny.
// Otherwise, the allow-all rule fires.
```

### highest-priority

The matching rule with the highest `priority` wins. Ties go to whichever was seen
first.

```typescript
const priorityPolicy = policy('priority-based')
  .algorithm('highest-priority')
  .rule('general-allow', r => r
    .allow()
    .on('read')
    .of('post')
    .priority(10)
  )
  .rule('emergency-deny', r => r
    .deny()
    .on('*')
    .of('*')
    .priority(100)
    .when(w => w.env('maintenanceMode', 'eq', true))
  )
  .build()

// During maintenance, the priority-100 deny rule beats the priority-10 allow.
```

## Cross-Policy AND-Combination

A combining algorithm resolves conflicts within one policy. Across policies, duck-iam
uses strict AND — every policy must allow for the final result to be `allow`.

```typescript
// Policy A: RBAC-generated, allows editors to update posts
// Policy B: Custom, denies updates on weekends

// On a weekday: Policy A allows, Policy B allows -> ALLOWED
// On a weekend: Policy A allows, Policy B denies  -> DENIED
```

Layer policies for defense in depth:

- The RBAC policy handles "who can do what".
- A time-based policy handles "when they can do it".
- A geo-fencing policy handles "where they can do it from".

Each policy evaluates independently. A deny from any one is final.

## The Default Effect

When no rules match inside a policy, the engine falls back to `defaultEffect` —
`"deny"` by default (fail closed):

```typescript
const engine = new Engine({
  adapter: myAdapter,
  defaultEffect: 'deny',  // this is the default
})
```

Fail-closed means an unmatched request denies instead of accidentally allowing.

## Debugging with explain()

`explain()` returns a full evaluation trace without firing side-effect hooks:

```typescript
const trace = await engine.explain(
  'user-1',
  'update',
  { type: 'post', id: 'post-42', attributes: { ownerId: 'user-1' } },
)

console.log(trace.summary)
// ALLOWED: "user-1" -> update on post
//   Roles: [editor]
//   __rbac__ [allow-overrides]: Allowed by rule "rbac.editor.update.post.2" (1/8 rules matched)
//   Result: Allowed by rule "rbac.editor.update.post.2"
```

The trace covers per-policy breakdowns, per-rule match details, and per-condition
actual vs. expected values.

---

## Core Concepts FAQ

  
    Can conditions reference action and scope directly?
    
      Yes. Field resolution supports <code className="rounded bg-muted px-2 py-1">action</code> and
      <code className="rounded bg-muted px-2 py-1">scope</code> as first-class shorthands in addition to
      <code className="rounded bg-muted px-2 py-1">subject</code>, <code className="rounded bg-muted px-2 py-1">resource</code>, and
      <code className="rounded bg-muted px-2 py-1">environment</code> paths.
    
  

  
    Are roles just shorthand for policies?
    
      Conceptually, yes. duck-iam converts resolved role permissions into a synthetic RBAC policy so that
      roles and ABAC rules go through the same evaluator. You still model them differently because roles are
      easier for common grants and policies are better for contextual logic.
    
  

  
    What happens when no rules or targets match?
    
      The evaluator falls back to the configured default effect, which is usually
      <code className="rounded bg-muted px-2 py-1">deny</code>. duck-iam treats "policy does not apply" and
      "no rule matched" as fail-closed outcomes unless you explicitly choose a different default.
    
  

  
    Why do scoped role assignments do nothing unless I pass a scope?
    
      Scoped roles are merged into the subject only for evaluations that include a matching request scope.
      Without a scope value, only global roles participate in authorization.
    
  

  
    Why do I see a __rbac__ policy in explain() output even though I never created one?
    
      Because duck-iam materializes your resolved role permissions into a synthetic RBAC policy before evaluation.
      That policy is how roles enter the same rule engine as your hand-written ABAC policies, so seeing
      <code className="rounded bg-muted px-2 py-1">__rbac__</code> in traces is expected.
    
  

  
    When should tenant or org information live in scope instead of environment or resource attributes?
    
      Put it in <code className="rounded bg-muted px-2 py-1">scope</code> when it should activate scoped role assignments
      and scope-aware permissions. Keep it in <code className="rounded bg-muted px-2 py-1">environment</code> or
      <code className="rounded bg-muted px-2 py-1">resource.attributes</code> when it is only extra context for conditions
      and should not change how subject roles are resolved.
    
  

  
    How exactly does hierarchical resource matching work?
    
      It is one-way and prefix-based. A rule targeting <code className="rounded bg-muted px-2 py-1">dashboard</code> matches
      requests for <code className="rounded bg-muted px-2 py-1">dashboard</code> and
      <code className="rounded bg-muted px-2 py-1">dashboard.users</code>, but a rule targeting
      <code className="rounded bg-muted px-2 py-1">dashboard.users</code> does not match a request for the broader
      <code className="rounded bg-muted px-2 py-1">dashboard</code> resource.
    
  

  
    What is the practical difference between "policy did not apply" and "no rule matched"?
    
      Both end up flowing into the evaluator's default-effect behavior, but they happen at different layers. A target
      miss means the whole policy was skipped before rule evaluation. "No rule matched" means the policy applied, but none
      of its rules produced an allow or deny outcome.