## Install

```typescript
import { createVueAccess, ACCESS_INJECTION_KEY } from '@gentleduck/iam/client/vue'
```

Vue 3 is an optional peer dep. The factory accepts your reactive utilities (`ref`, `inject`, `provide`, `defineComponent`) to avoid a hard version dependency.

***

## Setup

Create the Vue access control system by passing Vue's reactive utilities. This avoids a hard Vue version dependency.

```typescript
// lib/access.ts
import { ref, computed, inject, provide, defineComponent, h } from 'vue'
import { createVueAccess } from '@gentleduck/iam/client/vue'

export const { useAccess, provideAccess, createAccessPlugin, Can, Cannot } = createVueAccess({
  ref,
  computed,
  inject,
  provide,
  defineComponent,
  h,
})
```

Type the system to your unions:

```typescript
type Action = 'create' | 'read' | 'update' | 'delete'
type Resource = 'post' | 'team'
type Scope = 'org-1'

export const access = createVueAccess<Action, Resource, Scope>({ ref, computed, inject, provide, defineComponent, h })
```

***

## Plugin installation

Install the plugin in your Vue app to make permissions available to all components.

```typescript
// main.ts
import { createApp } from 'vue'
import { createAccessPlugin } from '@/lib/access'
import App from './App.vue'

const app = createApp(App)

// permissions is a PermissionMap from your server
app.use(createAccessPlugin(permissions))

app.mount('#app')
```

The plugin also registers `$can` and `$cannot` as global properties for direct template use:

```html
<button v-if="$can('delete', 'post')">Delete</button>
```

***

## Composable

Use `useAccess` in any component within the provider tree.

```vue
<script setup lang="ts">
import { useAccess } from '@/lib/access'

const { can, cannot, permissions, update } = useAccess()
</script>

<template>
  <div>
    <button v-if="can('update', 'post')">Edit</button>
    <button v-if="can('delete', 'post')">Delete</button>
    <p v-if="cannot('manage', 'team')">Contact an admin to manage teams.</p>
  </div>
</template>
```

The composable returns:

| Property | Type | Description |
| --- | --- | --- |
| `permissions` | `Ref<PermissionMap>` | Reactive permission map |
| `can` | `(action, resource, resourceId?, scope?) -> boolean` | Check if allowed |
| `cannot` | `(action, resource, resourceId?, scope?) -> boolean` | Check if denied |
| `update` | `(newPerms) -> void` | Replace the permission map (triggers reactivity) |

`useAccess` **throws** when no provider/plugin is found. This is intentional - it surfaces missing setup immediately instead of silently rendering a locked-down UI.

***

## Can and Cannot components

Declarative permission gates using slots.

```vue
<template>
  <Can action="delete" resource="post">
    <button>Delete Post</button>
  </Can>

  <Can action="read" resource="analytics">
    <template #default>
      <AnalyticsPanel />
    </template>
    <template #fallback>
      <p>Upgrade to Pro to access analytics.</p>
    </template>
  </Can>

  <Cannot action="create" resource="post">
    <p>You do not have permission to create posts.</p>
  </Cannot>
</template>
```

`Can` renders the default slot when allowed, or the `fallback` slot when denied. `Cannot` renders its default slot when denied.

***

## Manual provide/inject

If you prefer not to use the plugin, call `provideAccess` in a parent component. Useful in SSR setups where you hydrate permissions per-request instead of at app startup.

```vue
<script setup lang="ts">
import { provideAccess } from '@/lib/access'

// permissions is a PermissionMap from your server
const state = provideAccess(permissions)
// state has the same shape as useAccess(): { permissions, can, cannot, update }
</script>
```

Child components can then call `useAccess()` as usual.

***

## createAccessState (low-level)

For full control without provide/inject, use `createAccessState` directly. It returns a reactive state object without registering it in the injection system.

```typescript
import { createAccessState } from '@/lib/access'

const state = createAccessState(permissionsFromServer)
state.can('delete', 'post') // boolean
state.permissions.value // reactive Ref<PermissionMap>
state.update(newPermissions) // replaces and triggers reactivity
```

This is returned from `createVueAccess()` alongside the other exports. Combine it with your own provide call (e.g. for SSR-specific keys) when the default plugin or `provideAccess` doesn't fit.

***

## ACCESS\_INJECTION\_KEY

Exported `Symbol` used by `provideAccess`/`useAccess` internally. You can re-use it if you need to bypass the helpers and call `provide(ACCESS_INJECTION_KEY, state)` yourself - for example, when wiring duck-iam into a custom plugin pipeline.

```typescript
import { provide } from 'vue'
import { ACCESS_INJECTION_KEY } from '@gentleduck/iam/client/vue'
import { createAccessState } from '@/lib/access'

const state = createAccessState(permissions)
provide(ACCESS_INJECTION_KEY, state)
```

***

## When to use what

| Need | Use |
| --- | --- |
| Whole-app setup | `createAccessPlugin` + `app.use(plugin)` |
| Component-tree setup (SSR) | `provideAccess` in a parent |
| Compose reactive state outside the tree | `createAccessState` |
| Permission check in template | `useAccess` + `v-if` or `<Can>`/`<Cannot>` |
| Permission check in script | `useAccess` |