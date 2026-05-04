## Overview

duck-iam ships client libraries for browser permission checks. The recommended
pattern is server-driven: generate a `PermissionMap` on the server, send it to the
client, and use it for UI decisions.

Every client library supports the same core operations:

- `can(action, resource, resourceId?, scope?)`: returns `true` when the permission is
  granted.
- `cannot(action, resource, resourceId?, scope?)`: returns `true` when the permission
  is denied.

Client checks are synchronous lookups against the pre-computed map. No network
requests during checks.

### The PermissionMap

A `PermissionMap` is a flat object — keys encode the permission, values are booleans.
Keys take one of four shapes depending on which fields are present:

```typescript
{
  // Format: "action:resource"
  "create:post": true,
  "delete:post": true,
  "manage:team": false,

  // Format: "action:resource:resourceId"
  "delete:post:abc123": false,

  // Format: "scope:action:resource"
  "org-1:manage:billing": true,

  // Format: "scope:action:resource:resourceId"
  "org-1:update:post:post-42": true,
}
```

Generate it on the server with `engine.permissions()` or the `getPermissions` helper
from `@gentleduck/iam/server/next`. Missing keys return `false` (deny by default).

### Permission keys and buildPermissionKey

The same key builder powers every client integration:

```typescript

buildPermissionKey('delete', 'post')
// "delete:post"

buildPermissionKey('update', 'post', 'post-42', 'org-1')
// "org-1:update:post:post-42"
```

You rarely call `buildPermissionKey()` directly — the React, Vue, and vanilla
clients call it internally. Reach for it when generating or inspecting
`PermissionMap` objects in tests, server endpoints, or custom helpers.

---

## React

```

```

### Setup

Create the access control system once at app initialization. Pass your React import to avoid a hard dependency.

```typescript
// lib/access.tsx

export const {
  AccessProvider,
  useAccess,
  usePermissions,
  Can,
  Cannot,
} = createAccessControl(React)
```

### AccessProvider

Wrap your app (or a subtree) with the provider. Pass the permission map generated on the server.

```tsx
// app/layout.tsx (Next.js example)

export default async function RootLayout({ children }) {
  const session = await auth()
  const permissions = session?.user
    ? await getPermissions(engine, session.user.id, [
        { action: 'create', resource: 'post' },
        { action: 'delete', resource: 'post' },
        { action: 'manage', resource: 'team' },
        { action: 'read', resource: 'analytics' },
      ])
    : {}

  return (

      }>

  if (error) return 

  return (
    }

  )
}
```

The hook returns:

| Property | Type | Description |
| --- | --- | --- |
| `permissions` | `PermissionMap` | The fetched permission map |
| `can` | `(action, resource, resourceId?, scope?) -> boolean` | Permission checker |
| `loading` | `boolean` | True while the fetch is in progress |
| `error` | `Error or null` | Error from the fetch, if any |

The hook handles race conditions internally: if the component unmounts or the dependency
array changes before the fetch completes, stale results are discarded.

### Standalone checker

For code outside React components (utilities, event handlers, tests), use `createPermissionChecker`. It takes a `PermissionMap` and returns a checker object with `can`, `cannot`, and the raw `permissions`.

```typescript

const checker = createPermissionChecker(permissionMap)
checker.can('delete', 'post')         // boolean
checker.cannot('manage', 'team')      // boolean
checker.permissions                    // the original PermissionMap
```

---

## Vue

```

```

### Setup

Create the Vue access control system by passing Vue's reactive utilities. This avoids a hard Vue version dependency.

```typescript
// lib/access.ts

export const {
  useAccess,
  provideAccess,
  createAccessPlugin,
  Can,
  Cannot,
} = createVueAccess({ ref, computed, inject, provide, defineComponent, h })
```

### Plugin installation

Install the plugin in your Vue app to make permissions available to all components.

```typescript
// main.ts

const app = createApp(App)

// permissions is a PermissionMap from your server
app.use(createAccessPlugin(permissions))

app.mount('#app')
```

The plugin also registers `$can` and `$cannot` as global properties for direct template use:

```html

- **Security**: Permission logic runs on the server where policies and roles are stored. The client only sees the final boolean results.
- **Performance**: Client-side checks are instant object lookups. No async operations, no network requests, no engine evaluation.
- **Consistency**: The server is the single source of truth. The client reflects exactly what the server decided.
- **Simplicity**: The client libraries are thin wrappers around a flat object.

### Refreshing permissions

When a user's role changes (promoted, joined an org, feature flag flips), fetch a new permission map from the server and update the client.

**React:**

```tsx
// Re-render the server component (Next.js router.refresh())
// or use usePermissions with a refetch trigger
```

**Vue:**

```typescript
const { update } = useAccess()
const newPerms = await fetch('/api/me/permissions').then(r => r.json())
update(newPerms)
```

**Vanilla:**

```typescript
const newPerms = await fetch('/api/me/permissions').then(r => r.json())
access.update(newPerms) // subscribers are notified automatically
```

---

## Client Integration FAQ

  
    Do the React, Vue, and vanilla clients evaluate roles and policies themselves?
    
      Not by default. The client integrations are built around a <code className="rounded bg-muted px-2 py-1">PermissionMap</code>
      and fast boolean lookups. The engine still belongs on the server unless you intentionally embed it in a trusted client runtime.
    
  

  
    Why should I generate a permission map on the server instead of checking in every component?
    
      Server-generated permission maps keep policies and role data on the server, avoid repeated evaluation in the UI,
      produce deterministic hydration, and reduce the client-side integration to cheap object lookups.
    
  

  
    When should I use createAccessControl() versus createPermissionChecker() in React?
    
      Use <code className="rounded bg-muted px-2 py-1">createAccessControl()</code> when you want provider-based access,
      hooks, and declarative <code className="rounded bg-muted px-2 py-1">Can</code>/<code className="rounded bg-muted px-2 py-1">Cannot</code> gates.
      Use <code className="rounded bg-muted px-2 py-1">createPermissionChecker()</code> for isolated checks without React context.
    
  

  
    What does React usePermissions() do, and what does it not do?
    
      It asynchronously loads a permission map and exposes <code className="rounded bg-muted px-2 py-1">loading</code> and
      <code className="rounded bg-muted px-2 py-1">error</code> state. It does not run the engine for you, and it does not abort
      in-flight requests; it only ignores late results after unmount.
    
  

  
    Why does Vue useAccess() throw instead of returning an empty state?
    
      The Vue integration assumes permission state must be provided explicitly. Throwing early catches missing
      provider or plugin setup immediately instead of silently rendering a locked-down UI.
    
  

  
    What does the Vue plugin install globally?
    
      It provides the reactive access state through dependency injection and also exposes
      <code className="rounded bg-muted px-2 py-1">$can</code> and <code className="rounded bg-muted px-2 py-1">$cannot</code>
      on <code className="rounded bg-muted px-2 py-1">app.config.globalProperties</code>.
    
  

  
    When should I use the vanilla AccessClient?
    
      Use it in non-React or non-Vue frontends, Web Components, small islands, or anywhere you want a subscribable
      permission store with <code className="rounded bg-muted px-2 py-1">update()</code>,
      <code className="rounded bg-muted px-2 py-1">merge()</code>, <code className="rounded bg-muted px-2 py-1">allowedActions()</code>,
      and <code className="rounded bg-muted px-2 py-1">hasAnyOn()</code>.
    
  

  
    Can a client-side PermissionMap answer live attribute-sensitive questions?
    
      Not in the general case. A permission map is a flattened result for a known set of checks. If the answer depends on
      fresh resource attributes or server-side context, the evaluation still belongs on the server or in a trusted engine runtime.
    
  

  
    When should I include resourceId or scope in a client-side check?
    
      Include them whenever the server generated a resource-specific or scope-specific permission. If your map contains
      keys like <code className="rounded bg-muted px-2 py-1">org-1:update:post:post-42</code>, the client must call
      <code className="rounded bg-muted px-2 py-1">can('update', 'post', 'post-42', 'org-1')</code> to hit the same key.
    
  

  
    What happens when the permission map is stale or missing a key?
    
      The clients fail closed and return <code className="rounded bg-muted px-2 py-1">false</code>. That is the right
      default for rendering gates, but it also means you should refresh the permission map after role, scope, or feature
      changes that affect the visible UI.
    
  

  
    Are allowedActions() and hasAnyOn() safe for record-level decisions?
    
      Not by themselves. They summarize the keys already present in the map for a resource type, which is useful for
      broad UI decisions. Record ownership, fresh attributes, and server-only context still belong in server evaluation.
    
  

  
    Should I build PermissionMap keys manually?
    
      Prefer <code className="rounded bg-muted px-2 py-1">buildPermissionKey()</code> if you need to compose keys
      outside the shipped clients. It keeps your custom code aligned with the exact key order used by
      <code className="rounded bg-muted px-2 py-1">engine.permissions()</code>, the Next helper, and the vanilla client.
    
  

  
    What happens if I forget the scope or resourceId when the map only contains a scoped or instance key?
    
      The lookup misses and returns <code className="rounded bg-muted px-2 py-1">false</code>. The client does not try to
      "best guess" a broader permission from a narrower key, so the shape of your
      <code className="rounded bg-muted px-2 py-1">can(...)</code> call needs to match the shape of the key the server generated.