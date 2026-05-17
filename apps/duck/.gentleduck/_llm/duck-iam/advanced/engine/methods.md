## engine.can()

The simplest check. Returns `true` or `false`.

```typescript
const allowed = await engine.can(
  'user-1', // subject ID
  'update', // action
  { type: 'post', attributes: {} }, // resource
)

if (!allowed) {
  throw new Error('Forbidden')
}
```

**Signature:**

```typescript
engine.can(
  subjectId: string,
  action: string,
  resource: Resource,
  environment?: Environment,
  scope?: string,
): Promise<boolean>
```

`can()` always returns boolean regardless of engine mode. It's the simple-API method - use it when you don't need the full decision metadata.

***

## engine.check()

Same as `can()` but returns the full `Decision` object instead of a boolean (in development mode):

```typescript
const decision = await engine.check('user-1', 'delete', {
  type: 'post',
  id: 'post-123',
  attributes: { ownerId: 'user-2' },
})

if (!decision.allowed) {
  console.log('Denied:', decision.reason)
  // "Denied: No matching rules -> deny"
}
```

In production mode, `check()` returns a plain `boolean` - same as `can()`. The Decision object is a development-mode feature.

Use `check()` when you want to log/audit the deciding policy and rule, not just the outcome.

***

## engine.authorize()

Takes a complete `AccessRequest` object. The low-level method that `can()` and `check()` call internally. Use it when you already have a resolved subject:

```typescript
const subject = await engine.resolveSubject('user-1') // internal helper

const decision = await engine.authorize({
  subject,
  action: 'update',
  resource: { type: 'post', id: 'post-123', attributes: { ownerId: 'user-1' } },
  environment: { ip: '192.168.1.1' },
  scope: 'org-1',
})
```

If the request includes a `scope`, the engine enriches the subject with matching scoped roles before evaluation. For example, if the subject has `scopedRoles: [{ role: 'admin', scope: 'org-1' }]` and the request scope is `'org-1'`, `'admin'` is added to the effective roles for this check.

If any error occurs during evaluation (adapter failure, hook exception, etc.), the engine catches it, calls the `onError` hook if defined, and returns a deny decision with the error message as the reason.

**Caveat:** if your `onError` hook itself throws, the surrounding `authorize()` / `can()` / `check()` call can reject.

***

## engine.permissions()

Batch check multiple permissions at once. Loads data once, evaluates many. Returns a typed `PermissionMap` keyed by one of four forms:

* `"action:resource"`
* `"action:resource:resourceId"`
* `"scope:action:resource"`
* `"scope:action:resource:resourceId"`

```typescript
const perms = await engine.permissions('user-1', [
  { action: 'read', resource: 'post' },
  { action: 'create', resource: 'post' },
  { action: 'delete', resource: 'post' },
  { action: 'manage', resource: 'user' },
])

// perms = {
//   'read:post': true,
//   'create:post': true,
//   'delete:post': false,
//   'manage:user': false,
// }
```

Each check in the array is a `PermissionCheck`:

```typescript
interface PermissionCheck<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> {
  readonly action: TAction
  readonly resource: TResource
  readonly resourceId?: string
  readonly scope?: TScope
}
```

This is the method to use when rendering a UI that needs many permissions at once (which buttons to show/hide). It's also what server middleware uses to generate `PermissionMap` objects for client hydration.

The returned map uses the same key format as the client libraries and the root-level `buildPermissionKey()` helper. If you're writing custom hydration code, tests, or a framework integration outside the shipped clients, prefer that helper instead of hand-building key strings.

### With scopes and resource IDs

```typescript
const perms = await engine.permissions('user-1', [
  { action: 'update', resource: 'post', resourceId: 'post-123', scope: 'org-1' },
  { action: 'delete', resource: 'post', resourceId: 'post-123', scope: 'org-1' },
])

// perms = {
//   'org-1:update:post:post-123': true,
//   'org-1:delete:post:post-123': false,
// }
```

### Performance note

`permissions()` resolves the subject and policies **once**, then evaluates each requested permission with its own scope and hooks. It's much faster than calling `can()` in a loop - single DB hit, single subject resolution, batch evaluation.

For large arrays (50+ checks), `permissions()` outperforms a loop by 10x+.

***

## engine.explain()

Returns a full evaluation trace. **Development mode only** - calling in production mode throws.

```typescript
const result = await engine.explain('user-1', 'delete', {
  type: 'post',
  id: 'post-1',
  attributes: { ownerId: 'user-2' },
})

console.log(result.summary)
console.log(result.policies) // per-policy breakdowns
console.log(result.rules) // per-rule match details with actual vs expected values
```

`explain()` runs the same pipeline as `check()` but builds a richer trace object instead of a `Decision`. Side-effect hooks (`afterEvaluate`, `onDeny`, `onError`) **do not fire** - it's read-only.

`beforeEvaluate` does run, since it can affect the evaluation (e.g. adding timestamp to the environment).

See [explain and debug](/duck-iam/advanced/explain) for the full trace API.

***

## When to use which

| Need | Use |
| --- | --- |
| Simple yes/no check | `can()` |
| Decision metadata (rule/policy/reason) | `check()` |
| Pre-built AccessRequest | `authorize()` |
| Batch checks for UI hydration | `permissions()` |
| Debugging why a decision happened | `explain()` |