## Overview

The engine handles most use cases, but sometimes you need the underlying primitives.
duck-iam exports a set of low-level functions for pattern matching, field resolution,
and condition evaluation. These are the same functions the engine uses internally.

Typical reasons to reach for them:

* Custom routing guards that match action/resource patterns without a full engine call.
* Unit tests that assert matching logic in isolation.
* Server middleware that resolves request attributes before evaluation.
* Hand-rolled evaluation pipelines where you compose the pieces yourself.

All imports come from the root package:

```typescript
import {
  matchesAction,
  matchesResource,
  matchesResourceHierarchical,
  matchesScope,
  resolve,
  evaluateOperator,
  resolveConditionValue,
} from '@gentleduck/iam'
```

## Pattern Matchers

Four functions handle the pattern matching that rules use to decide whether they apply
to a given action, resource, or scope.

### matchesAction

Matches an action string against a pattern. `'*'` matches everything. Patterns ending
in `:*` match any action that shares the prefix.

```typescript
import { matchesAction } from '@gentleduck/iam'

matchesAction('*', 'delete')           // true  -- wildcard
matchesAction('read', 'read')          // true  -- exact
matchesAction('read', 'write')         // false
matchesAction('posts:*', 'posts:read') // true  -- prefix
matchesAction('posts:*', 'users:read') // false
```

**Signature:**

```typescript
function matchesAction(pattern: string, action: string): boolean
```

### matchesResource

Matches a resource type against a pattern. Same wildcard rules as `matchesAction`,
plus hierarchical prefix matching: `'org'` matches `'org:project:doc'`.

```typescript
import { matchesResource } from '@gentleduck/iam'

matchesResource('*', 'post')                // true
matchesResource('post', 'post')             // true
matchesResource('post', 'comment')          // false
matchesResource('org:*', 'org:project')     // true  -- prefix wildcard
matchesResource('org', 'org:project:doc')   // true  -- parent matches children
```

**Signature:**

```typescript
function matchesResource(pattern: string, resourceType: string): boolean
```

### matchesResourceHierarchical

Dot-notation variant of resource matching. `'dashboard'` matches
`'dashboard.users.settings'`. A `'.*'` suffix matches any child but not the
parent itself.

```typescript
import { matchesResourceHierarchical } from '@gentleduck/iam'

matchesResourceHierarchical('*', 'anything')                       // true
matchesResourceHierarchical('dashboard', 'dashboard')              // true
matchesResourceHierarchical('dashboard', 'dashboard.users')        // true
matchesResourceHierarchical('dashboard.*', 'dashboard.users')      // true
matchesResourceHierarchical('dashboard.*', 'dashboard')            // false -- parent excluded
```

**Signature:**

```typescript
function matchesResourceHierarchical(pattern: string, resourceType: string): boolean
```

### matchesScope

Scope matching for multi-tenant checks. A `null`/`undefined` or `'*'` pattern matches
any scope (global permission). If the request has no scope, only global patterns match.
Otherwise exact match.

```typescript
import { matchesScope } from '@gentleduck/iam'

matchesScope(null, null)          // true  -- both global
matchesScope(undefined, 'org-1')  // true  -- global pattern matches any scope
matchesScope('*', 'org-1')        // true  -- wildcard
matchesScope('org-1', 'org-1')    // true  -- exact
matchesScope('org-1', 'org-2')    // false
matchesScope('org-1', null)       // false -- scoped pattern, no request scope
```

**Signature:**

```typescript
function matchesScope(
  pattern: string | undefined | null,
  scope: string | undefined | null,
): boolean
```

## Field Resolution

### resolve

Resolves a dot-path string against a `IamRequest.IAccessRequest`. The engine uses this to extract
field values when evaluating conditions (e.g., `'resource.attributes.ownerId'`).

Supported root paths: `subject.*`, `resource.*`, `environment.*`. Two shorthands exist:
`'action'` returns the request action, `'scope'` returns the request scope (or `null`).
Returns `null` for invalid paths. Blocks `__proto__`, `constructor`, and `prototype`
traversal.

```typescript
import { resolve } from '@gentleduck/iam'

const request = {
  subject: { id: 'user-1', roles: ['editor'], attributes: { department: 'eng' } },
  action: 'update',
  resource: { type: 'post', id: 'post-5', attributes: { ownerId: 'user-1' } },
  environment: { ip: '10.0.0.1' },
}

resolve(request, 'subject.id')                     // 'user-1'
resolve(request, 'subject.attributes.department')  // 'eng'
resolve(request, 'resource.attributes.ownerId')    // 'user-1'
resolve(request, 'environment.ip')                 // '10.0.0.1'
resolve(request, 'action')                         // 'update'
resolve(request, 'scope')                          // null
resolve(request, 'invalid.path')                   // null
```

**Signature:**

```typescript
function resolve(request: IamRequest.IAccessRequest, path: string): AttributeValue
```

`AttributeValue` is `string | number | boolean | null | string[] | number[]`.

## Condition Utilities

Two functions from the condition evaluator are exported for use in custom pipelines
and testing.

### evaluateOperator

Evaluates a single condition operator against two values. This is the function the
engine calls for each leaf condition. Supports all built-in operators:

`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`, `contains`, `not_contains`,
`starts_with`, `ends_with`, `matches`, `exists`, `not_exists`, `subset_of`,
`superset_of`.

```typescript
import { evaluateOperator } from '@gentleduck/iam'

evaluateOperator('eq', 'admin', 'admin')            // true
evaluateOperator('neq', 'viewer', 'admin')           // true
evaluateOperator('gt', 10, 5)                        // true
evaluateOperator('in', 'editor', ['admin', 'editor']) // true
evaluateOperator('contains', ['a', 'b', 'c'], 'b')  // true
evaluateOperator('starts_with', 'hello world', 'hello') // true
evaluateOperator('matches', 'user-123', '^user-\\d+$')  // true
evaluateOperator('exists', 'anything', null)         // true
evaluateOperator('not_exists', null, null)           // true
```

**Signature:**

```typescript
function evaluateOperator(
  op: Operator,
  fieldValue: AttributeValue,
  condValue: AttributeValue,
): boolean
```

### resolveConditionValue

Resolves `$`-prefixed variable references in condition values. If the value starts
with `$subject.`, `$resource.`, or `$environment.`, it is resolved against the request
using the same dot-path logic as `resolve()`. Otherwise the value passes through
unchanged. The engine calls this internally so conditions like
`{ field: 'resource.attributes.ownerId', operator: 'eq', value: '$subject.id' }`
work.

The `matches` operator is the one exception: it refuses any `$`-resolved right-hand-side
to prevent a malicious attribute from injecting a catastrophic regex (ReDoS lockdown).
A `matches` condition whose `value` resolves through `$subject.*` / `$resource.*` /
`$environment.*` evaluates to `false` and the leaf is treated as a non-match. Use a
literal pattern string for `matches`.

```typescript
import { resolveConditionValue } from '@gentleduck/iam'

const request = {
  subject: { id: 'user-1', roles: ['editor'], attributes: {} },
  action: 'update',
  resource: { type: 'post', attributes: { ownerId: 'user-1' } },
}

resolveConditionValue(request, '$subject.id')                  // 'user-1'
resolveConditionValue(request, '$resource.attributes.ownerId') // 'user-1'
resolveConditionValue(request, 'literal-string')               // 'literal-string'
resolveConditionValue(request, 42)                             // 42
```

**Signature:**

```typescript
function resolveConditionValue(
  req: IamRequest.IAccessRequest,
  value: AttributeValue,
): AttributeValue
```

## Internal behavior worth knowing

A few engine-level invariants the utility functions inherit:

* **Deep-frozen RBAC policy.** The synthetic RBAC policy built from role definitions is
  recursively `Object.freeze`d in cache. Every consumer (`evaluate`, `explain`,
  `evaluateFast`) reads the same reference; mutating an array on a shared rule would
  corrupt every future request, so writes throw in strict mode.
* **Regex LRU cache for `matches`.** The condition evaluator compiles `matches` patterns
  once and stores them in an LRU with bounded capacity. Repeated hits skip recompilation;
  cache eviction is least-recently-used to bound memory under hostile pattern churn.
* **IamHttpAdapter null on 404.** `IamHttpAdapter.getPolicy(id)` and `IamHttpAdapter.getRole(id)`
  treat a `404 Not Found` response as "missing" and return `null` rather than throwing.
  Other non-2xx statuses still throw so transport errors are not silently swallowed.
* **`matches` operator refuses `$`-resolved RHS.** See `resolveConditionValue` above.

## Row parsers - adapter authors

If you're writing a custom adapter (your data lives in a system that the
built-in adapters don't speak to), validate every row before returning
it to the engine. duck-iam ships two helpers for exactly this:

```typescript
import { parsePolicyRow, parseRoleRow } from '@gentleduck/iam/core/validate'

class MyAdapter implements IamAdapter.IAdapter {
  async listPolicies() {
    const rows = await this.myStore.fetchPolicies()
    const out = []
    for (const row of rows) {
      const policy = parsePolicyRow<TAction, TResource, TRole>(row)
      if (policy !== null) out.push(policy)
      // else: drop the malformed row (log it if you want, but never
      // return un-validated rows to the engine)
    }
    return out
  }
}
```

`parsePolicyRow` returns `null` on any validation failure; the engine
treats `null` as "drop this row." This replaces the older pattern of
calling `validatePolicy(row)` and then casting `row as IPolicy<...>` -
the cast was a type-safety hole; the parser is not.

Use cases:

* A custom JSON-column SQL adapter where rows can be malformed by hand.
* A migration tool that reads rows from one store and writes them to
  another; you want to drop malformed rows instead of crashing.
* A staging endpoint that lets operators preview policies before commit.

`parseRoleRow` mirrors `parsePolicyRow` for `IamAdapter.IRoleStore.listRoles`
/ `getRole` return values.