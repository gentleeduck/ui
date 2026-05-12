## How it works

duck-iam ships client libraries for browser permission checks. The recommended pattern is **server-driven**: generate a `PermissionMap` on the server, send it to the client, and use it for UI decisions.

Every client library supports the same core operations:

* `can(action, resource, resourceId?, scope?)` — returns `true` when the permission is granted
* `cannot(action, resource, resourceId?, scope?)` — returns `true` when the permission is denied

Client checks are **synchronous lookups** against the pre-computed map. No network requests during checks.

***

## Pick a client

| Framework | Doc | Subpath |
| --- | --- | --- |
| React | [client/react](/docs/duck-iam/integrations/client/react) | `@gentleduck/iam/client/react` |
| Vue | [client/vue](/docs/duck-iam/integrations/client/vue) | `@gentleduck/iam/client/vue` |
| Vanilla JS | [client/vanilla](/docs/duck-iam/integrations/client/vanilla) | `@gentleduck/iam/client/vanilla` |

Use the [PermissionMap reference](/docs/duck-iam/integrations/client/permission-map) for the wire format, key encoding, and `buildPermissionKey()` helper.

***

## Server-driven pattern

* **Security** — Permission logic runs on the server where policies and roles are stored. The client only sees the final boolean results.
* **Performance** — Client-side checks are instant object lookups. No async, no network, no engine evaluation.
* **Consistency** — The server is the single source of truth.
* **Simplicity** — The client libraries are thin wrappers around a flat object.

***

## Refreshing permissions

When a user's role changes (promoted, joined an org, feature flag flips), fetch a new permission map from the server and update the client.

**React:**

```tsx
// Re-render the server component (Next.js router.refresh())
// or use usePermissions with a refetch trigger
```

**Vue:**

```typescript
const { update } = useAccess()
const newPerms = await fetch('/api/me/permissions').then((r) => r.json())
update(newPerms)
```

**Vanilla:**

```typescript
const newPerms = await fetch('/api/me/permissions').then((r) => r.json())
access.update(newPerms) // subscribers are notified automatically
```

***

## FAQ

Do the React, Vue, and vanilla clients evaluate roles and policies themselves?

Not by default. The client integrations are built around a <code className="rounded bg-muted px-2 py-1">PermissionMap</code>
and fast boolean lookups. The engine still belongs on the server unless you intentionally embed it in a trusted client runtime.

Why should I generate a permission map on the server instead of checking in every component?

Server-generated permission maps keep policies and role data on the server, avoid repeated evaluation in the UI,
produce deterministic hydration, and reduce the client-side integration to cheap object lookups.

Can a client-side PermissionMap answer live attribute-sensitive questions?

Not in the general case. A permission map is a flattened result for a known set of checks. If the answer depends on
fresh resource attributes or server-side context, the evaluation still belongs on the server or in a trusted engine runtime.

What happens when the permission map is stale or missing a key?

The clients fail closed and return <code className="rounded bg-muted px-2 py-1">false</code>. That is the right
default for rendering gates, but it also means you should refresh the permission map after role, scope, or feature
changes that affect the visible UI.