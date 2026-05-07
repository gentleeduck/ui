## Install

```typescript

```

React is an optional peer dep. The factory accepts your `React` import to avoid a hard version dependency.

---

## Setup

Create the access control system once at app initialization. Pass your React import to avoid a hard dependency.

```typescript
// lib/access.tsx

export const { AccessProvider, useAccess, usePermissions, Can, Cannot } = createAccessControl(React)
```

Type the system to your action/resource/scope unions:

```typescript
type Action = 'create' | 'read' | 'update' | 'delete'
type Resource = 'post' | 'comment' | 'team'
type Scope = 'org-1' | 'admin'

export const access = createAccessControl

      }>

  if (error) return 

  return }</div>
}
```

The hook returns:

| Property | Type | Description |
| --- | --- | --- |
| `permissions` | `PermissionMap` | The fetched permission map |
| `can` | `(action, resource, resourceId?, scope?) -> boolean` | Permission checker |
| `loading` | `boolean` | True while the fetch is in progress |
| `error` | `Error or null` | Error from the fetch, if any |

The hook handles race conditions internally: if the component unmounts or the dependency array changes before the fetch completes, stale results are discarded.

`usePermissions` does **not** abort in-flight requests — it only ignores late results. If you need true cancellation, use the standalone checker with your own `AbortController` flow.

---

## Standalone checker

For code outside React components (utilities, event handlers, tests), use `createPermissionChecker`. It takes a `PermissionMap` and returns a checker object with `can`, `cannot`, and the raw `permissions`.

```typescript

const checker = createPermissionChecker(permissionMap)
checker.can('delete', 'post') // boolean
checker.cannot('manage', 'team') // boolean
checker.permissions // the original PermissionMap
```

Use this when you don't need React context — for example, in route loaders, form validators, or analytics event handlers.

---

## When to use what

| Need | Use |
| --- | --- |
| Wrap whole tree with permissions from RSC | `AccessProvider` + `useAccess` |
| Wrap whole tree with permissions from API | `AccessProvider` + `usePermissions` (or fetch in layout) |
| One-off check inside JSX | `<Can>` / `<Cannot>` |
| Check inside utility code | `createPermissionChecker` |

---

## React Server Components note

`AccessProvider` is a client component (uses `useMemo`/context). Mark the wrapper file with `"use client"` if you import it from a Server Component:

```tsx
'use client'

// ...
```

For server-side checks inside RSC/Server Actions, use [`checkAccess`](/docs/duck-iam/integrations/server/next) from `@gentleduck/iam/server/next` instead — that hits the engine directly without touching client context.