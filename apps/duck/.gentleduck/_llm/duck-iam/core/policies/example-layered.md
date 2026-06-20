## The setup

A blog with editors, admins, and content safety rules. Wire roles + ABAC together below.

```typescript
import { defineIam } from '@gentleduck/iam'

const access = defineIam({
  actions: ['create', 'read', 'update', 'delete', 'publish'] as const,
  resources: ['post', 'comment', 'user'] as const,
  scopes: ['org-alpha', 'org-beta'] as const,
  roles: ['viewer', 'editor', 'admin'] as const,
})
```

***

## RBAC: who can do what

```typescript
const viewer = access
  .defineRole('viewer')
  .name('Viewer')
  .grantRead('post', 'comment')
  .build()

const editor = access
  .defineRole('editor')
  .name('Editor')
  .inherits('viewer')
  .grantCRUD('post')
  .grant('publish', 'post')
  .grantCRUD('comment')
  .build()
```

***

## ABAC: business hours restriction

```typescript
const businessHours = access
  .definePolicy('business-hours')
  .name('Business Hours Only')
  .desc('Deny write operations outside business hours')
  .target({ actions: ['create', 'update', 'delete', 'publish'] })
  .algorithm('first-match')
  .rule('deny-off-hours', (r) =>
    r
      .deny()
      .on('*')
      .of('*')
      .when((w) =>
        w.or((w) => w.env('hour', 'lt', 9).env('hour', 'gte', 17)),
      ),
  )
  .rule('allow-in-hours', (r) => r.allow().on('*').of('*'))
  .build()
```

Targets the policy to writes only - read requests skip it entirely.

***

## ABAC: content safety

```typescript
const contentSafety = access
  .definePolicy('content-safety')
  .name('Content Safety')
  .algorithm('deny-overrides')
  .rule('owner-delete-only', (r) =>
    r
      .deny()
      .on('delete')
      .of('post')
      .when((w) =>
        w.not((w) => w.or((w) => w.isOwner().role('admin'))),
      ),
  )
  .rule('no-banned-users', (r) =>
    r
      .deny()
      .on('*')
      .of('*')
      .when((w) => w.attr('status', 'eq', 'banned')),
  )
  .build()
```

Logic: deny deletes that aren't owner-or-admin; deny everything for banned users.

***

## Wire it up

```typescript
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
```

***

## Run a check

```typescript
const allowed = await engine.can(
  'user-1',
  'update',
  { type: 'post', id: 'post-42', attributes: { ownerId: 'user-1' } },
  { hour: 14 }, // 2 PM - within business hours
)
// true: editor role allows update, business hours allows, content safety allows
```

***

## Evaluation walkthrough

The engine evaluates each policy then AND-combines the results.

1. **RBAC policy** (`allow-overrides`) - editor role grants `update` on `post` -> **allow**.
2. **business-hours** (`first-match`) - hour is 14, so `deny-off-hours` condition (`hour < 9 OR hour >= 17`) is false; the rule does not match. Next rule `allow-in-hours` has no conditions, so it matches -> **allow**.
3. **content-safety** (`deny-overrides`) - user is not banned (`status` is not `'banned'`); the `owner-delete-only` rule targets `delete` but the request is `update`, so no deny rules match, no allow rules to fire -> falls through to `defaultEffect`.
4. **Cross-policy AND** - RBAC allows, business-hours allows, content-safety uses default. All must allow -> **ALLOWED**.

***

## Watch out: deny-only policies + fail-closed default

A policy with only deny rules where none match falls through to `defaultEffect` (usually `'deny'`). To avoid an accidental deny:

* Add an explicit allow rule (as in the business-hours policy above), OR
* Use `first-match` or `allow-overrides` with a catch-all allow as the last rule, OR
* Set the engine `defaultEffect: 'allow'` and use deny policies as exceptions

The shape of your combining algorithm + the default effect together determine what "no rule matched" means. Plan that intentionally.

***

## Same flow with explain()

In development mode, swap `engine.can()` for `engine.explain()` to see exactly which policies and rules fired:

```typescript
const trace = await engine.explain('user-1', 'update', {
  type: 'post',
  id: 'post-42',
  attributes: { ownerId: 'user-1' },
}, { hour: 14 })

console.log(trace.summary)
// -> "ALLOWED - editor role grants update on post (RBAC), business-hours allow-in-hours matched, content-safety used defaultEffect"
```

See [explain and debug](/duck-iam/advanced/explain) for the full trace API.