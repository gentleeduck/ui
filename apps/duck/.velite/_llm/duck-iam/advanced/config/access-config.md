## Factory signature

```typescript

const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete', 'manage'] as const,
  resources: ['post', 'comment', 'user', 'dashboard'] as const,
  scopes: ['org-1', 'org-2'] as const,
  roles: ['viewer', 'editor', 'admin', 'super-admin'] as const,
})
```

---

## Input shape

```typescript
interface AccessConfigInput<TActions, TResources, TScopes, TRoles, TContext> {
  actions: TActions // readonly string[] with const assertion
  resources: TResources // readonly string[] with const assertion
  scopes?: TScopes // optional, readonly string[] with const assertion
  roles?: TRoles // optional, readonly string[] with const assertion
  context?: TContext // optional, phantom field for typed dot-path intellisense
}
```

| Field | Required | What it constrains |
| --- | --- | --- |
| `actions` | yes | `grant(action, ...)`, `r.on(action)`, `engine.can(_, action, ...)` |
| `resources` | yes | `grant(_, resource)`, `r.of(resource)`, resource targets |
| `scopes` | no | `forScope(scope)`, scoped `grant`, `engine.can(... scope)` |
| `roles` | no | `defineRole(id)`, `inherits(id)`, `w.role(id)`, `w.roles(...ids)` |
| `context` | no | Phantom field — see [typed context](/docs/duck-iam/advanced/config/context) |

If you omit `scopes` or `roles`, the config still works. Those parameters accept `string` without constraint. When `roles` is provided, `defineRole()`, `when().role()`, and all builders that reference roles are constrained to the declared role IDs.

---

## How `as const` works

TypeScript's `as const` assertion is required for type safety. Without it, arrays are widened:

```typescript
// Without as const — types are string[]
const actions = ['create', 'read', 'update']
// typeof actions = string[]

// With as const — types are literal tuples
const actions = ['create', 'read', 'update'] as const
// typeof actions = readonly ['create', 'read', 'update']
```

When you pass `as const` arrays to `createAccessConfig()`, the factory uses conditional types to extract the union of literal values:

```typescript
type TAction = (typeof actions)[number]
// = 'create' | 'read' | 'update'

type TRole = (typeof roles)[number]
// = 'viewer' | 'editor' | 'admin'
```

These union types flow through all builders, constraining every parameter: actions, resources, scopes, and roles.

---

## What you get back

`createAccessConfig()` returns an `AccessConfig` object with typed builder methods:

| Method | Purpose |
| --- | --- |
| `access.defineRole(id)` | Typed role builder |
| `access.policy(id)` | Typed policy builder |
| `access.defineRule(id)` | Typed standalone rule builder |
| `access.when()` | Typed condition builder for reusable groups |
| `access.createEngine(config)` | Typed engine instance |
| `access.checks(arr)` | Typed permission check array (for `engine.permissions()`) |
| `access.validateRoles(roles)` | Runtime validation, same as standalone `validateRoles()` |
| `access.validatePolicy(p)` | Runtime validation for untrusted policy objects |

See [methods reference](/docs/duck-iam/advanced/config/methods) for full details.

---

## Inferring types from the config

Sometimes you need the union types elsewhere — e.g. defining types in a shared module. Extract them from the config:

```typescript
const access = createAccessConfig({
  actions: ['create', 'read', 'update'] as const,
  resources: ['post'] as const,
})

type Action = Parameters<typeof access.defineRule>['0'] extends infer S
  ? S
  : never
// or via the input arrays directly:
type ActionFromInput = (typeof access)['_actions'][number]
```

In practice, define your unions next to the config and re-export:

```typescript
// access.ts
export const access = createAccessConfig({
  actions: ['create', 'read', 'update', 'delete'] as const,
  resources: ['post', 'comment'] as const,
} as const)

export type AppAction = 'create' | 'read' | 'update' | 'delete'
export type AppResource = 'post' | 'comment'
```

This is one source of truth for both runtime and type-level uses.

---

## Optional fields behavior

### Without `roles`

```typescript
const access = createAccessConfig({
  actions: ['read', 'write'] as const,
  resources: ['post'] as const,
  // no roles
})

access.defineRole('any-string-here') // OK — no constraint
access.when().role('any-string') // OK
```

Without a `roles` declaration, role-related parameters accept any string.

### Without `scopes`

```typescript
const access = createAccessConfig({
  actions: ['read'] as const,
  resources: ['post'] as const,
  // no scopes
})

access.defineRole('viewer').grant('read', 'post', 'any-scope') // OK — no constraint
```

Same — without `scopes`, scope params accept any string.

### Without `context`

The condition builder accepts any string for `.attr()`, `.resourceAttr()`, `.env()`, and `.check()` field paths, with `AttributeValue` for values. You lose dot-path autocomplete and value narrowing but the runtime behavior is identical.

See [typed context](/docs/duck-iam/advanced/config/context) for what `context` adds.