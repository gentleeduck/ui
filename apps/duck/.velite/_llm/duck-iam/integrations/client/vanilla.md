## Install

```typescript
import { AccessClient } from '@gentleduck/iam/client/vanilla'
```

Zero dependencies. Works in any JS runtime that supports `fetch` (browser, Node, Bun, Deno, edge runtimes).

---

## Basic usage

Create an `AccessClient` from a permission map:

```typescript
import { AccessClient } from '@gentleduck/iam/client/vanilla'

const access = new AccessClient(permissionsFromServer)

access.can('delete', 'post') // true
access.cannot('manage', 'billing') // true
access.can('manage', 'user', undefined, 'admin') // scoped check
```

---

## Fetch from server

`fromServer` sends a GET request, parses the JSON response as a `PermissionMap`, and returns a new `AccessClient`. It throws if the response is not OK (non-2xx status).

```typescript
const access = await AccessClient.fromServer('/api/me/permissions', {
  headers: { Authorization: 'Bearer ' + token },
})

access.can('delete', 'post') // boolean
```

The second argument is a standard `RequestInit`. A `Content-Type: application/json` header is added automatically.

---

## Allowed actions

`allowedActions` scans the permission map and returns a deduplicated array of action strings where the value is `true`. `hasAnyOn` short-circuits and returns as soon as it finds any allowed permission.

```typescript
access.allowedActions('post') // ['read', 'create', 'update']
access.hasAnyOn('billing') // false
access.hasAnyOn('post') // true
```

Both methods handle all four key formats. For a 3-part key like `"org-1:read:post"`, the method correctly identifies `"post"` as the resource and `"read"` as the action.

These helpers suit UI summarization: navigation menus, toolbar groups, or coarse "does this user have anything on posts?" checks. They scan the existing `PermissionMap` and **do not** replace server-side permission evaluation.

---

## Reactive updates

Subscribe to permission changes to trigger re-renders in any framework.

```typescript
const unsubscribe = access.subscribe((newPermissions) => {
  // Re-render your UI with the new permissions
  rerender()
})

// Update permissions (e.g. after role change)
access.update(newPermissionsFromServer)

// Merge new permissions into existing ones
access.merge({ 'manage:team': true })

// Clean up
unsubscribe()
```

`update` replaces the entire map. `merge` shallow-merges new entries into the existing map. Both notify subscribers in the order they registered.

---

## Framework integration patterns

### Svelte

```typescript
// stores/access.ts
import { writable, derived } from 'svelte/store'
import { AccessClient } from '@gentleduck/iam/client/vanilla'

const client = new AccessClient(initialPermissions)
const permissions = writable(client.permissions)

client.subscribe((perms) => permissions.set(perms))

export const can = (action: string, resource: string) =>
  derived(permissions, () => client.can(action, resource))
```

### Solid

```typescript
import { createSignal } from 'solid-js'
import { AccessClient } from '@gentleduck/iam/client/vanilla'

const client = new AccessClient(initialPermissions)
const [permissions, setPermissions] = createSignal(client.permissions)

client.subscribe(setPermissions)

export const can = (action: string, resource: string) => () => client.can(action, resource)
```

### Web Components

```typescript
class AccessGate extends HTMLElement {
  connectedCallback() {
    const action = this.getAttribute('action')
    const resource = this.getAttribute('resource')

    const render = () => {
      this.style.display = client.can(action, resource) ? '' : 'none'
    }

    render()
    this._unsub = client.subscribe(render)
  }

  disconnectedCallback() {
    this._unsub?.()
  }
}

customElements.define('access-gate', AccessGate)
```

```html
<access-gate action="delete" resource="post">
  <button>Delete</button>
</access-gate>
```

---

## API reference

| Method / Property | Type | Description |
| --- | --- | --- |
| `constructor(perms?)` | `new (PermissionMap?) -> AccessClient` | Create from a permission map |
| `AccessClient.fromServer(url, init?)` | `static async -> AccessClient` | Fetch permissions from an endpoint |
| `can(action, resource, resourceId?, scope?)` | `-> boolean` | Check if allowed |
| `cannot(action, resource, resourceId?, scope?)` | `-> boolean` | Check if denied |
| `allowedActions(resource)` | `-> string[]` | List all allowed actions for a resource |
| `hasAnyOn(resource)` | `-> boolean` | Check if any permission exists on a resource |
| `permissions` | `Readonly<PermissionMap>` | Current permission map (read-only) |
| `update(perms)` | `-> void` | Replace permissions and notify listeners |
| `merge(perms)` | `-> void` | Merge new permissions into existing and notify |
| `subscribe(fn)` | `-> () -> void` | Listen for changes, returns unsubscribe function |

---

## When to use

- Non-React, non-Vue frontends (Svelte, Solid, Lit, custom)
- Web Components / micro-frontends
- Browser extensions, Electron, Tauri
- Background scripts, service workers, web workers
- Tests where you want a quick subscribable store