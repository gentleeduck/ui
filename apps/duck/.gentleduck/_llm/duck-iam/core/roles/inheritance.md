## Inheriting permissions

When role B inherits from role A, B gets all of A's permissions plus its own. Chains can be arbitrarily deep.

```typescript
const viewer = defineRole('viewer')
  .name('Viewer')
  .grant('read', 'post')
  .grant('read', 'comment')
  .build()

const editor = defineRole('editor')
  .name('Editor')
  .inherits('viewer')
  .grant('create', 'post')
  .grant('update', 'post')
  .grant('delete', 'post')
  .build()

const admin = defineRole('admin').name('Admin').inherits('editor').grantAll('*').build()
```

Chain: `viewer -> editor -> admin`. An admin gets everything an editor can do (including everything a viewer can do), plus unrestricted access.

***

## How inheritance is resolved

The engine calls `resolveEffectiveRoles()` when loading a subject. For a user with `editor`, the function walks the inheritance tree and returns `['editor', 'viewer']` — the effective role set.

`rolesToPolicy()` flattens the inheritance chain when generating the ABAC policy. The editor role's rules include its own and viewer's permissions, each gated by a `subject.roles contains "editor"` condition.

***

## Cycles are safe

If role A inherits from B which inherits from A, the visited set breaks the recursion. The engine doesn't throw or hang — it just stops descending once it hits a role it's already visited.

`validateRoles()` flags cycles as warnings (not errors) because the runtime handles them safely, but circular inheritance is almost always a modeling mistake worth fixing.

***

## Multiple inheritance

A role can inherit from several parents:

```typescript
const moderator = defineRole('moderator')
  .name('Moderator')
  .inherits('viewer', 'commenter')
  .grant('delete', 'comment')
  .grant('update', 'comment')
  .build()
```

This pulls permissions from `viewer` and `commenter`, then adds the moderator's own.

***

## Caveat: removing inherited permissions

**Not supported.** If `editor` inherits `viewer`, viewer's `read` can't be stripped from the editor.

For finer-grain control, use an ABAC deny rule:

```typescript
const restrictedEditor = defineRole('restricted-editor').inherits('editor').build()

// Add a separate policy:
const restriction = policy('restrict-editor-deletes')
  .target({ roles: ['restricted-editor'] })
  .algorithm('deny-overrides')
  .rule('no-delete', (r) => r.deny().on('delete').of('post'))
  .build()
```

The `deny-overrides` semantics in cross-policy AND-combination ensure the deny wins. See [combining algorithms](/docs/duck-iam/core/policies/combining-algorithms).

***

## Deep chains

Resolved by walking the tree recursively, with a visited set to break cycles. Performance is **linear in the role count** — 10-level chains resolve in microseconds.

There's no hard cap on chain depth, but for clarity prefer flat hierarchies (≤3-4 levels). Deep chains hide where permissions actually originate.