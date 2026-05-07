## Install

```typescript

```

Vue 3 is an optional peer dep. The factory accepts your reactive utilities (`ref`, `inject`, `provide`, `defineComponent`) to avoid a hard version dependency.

---

## Setup

Create the Vue access control system by passing Vue's reactive utilities. This avoids a hard Vue version dependency.

```typescript
// lib/access.ts

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

export const access = createVueAccess

      <p>Upgrade to Pro to access analytics.</p>

    <p>You do not have permission to create posts.</p>

```

`Can` renders the default slot when allowed, or the `fallback` slot when denied. `Cannot` renders its default slot when denied.

---

## Manual provide/inject

If you prefer not to use the plugin, call `provideAccess` in a parent component. Useful in SSR setups where you hydrate permissions per-request instead of at app startup.

```vue

// permissions is a PermissionMap from your server
const state = provideAccess(permissions)
// state has the same shape as useAccess(): { permissions, can, cannot, update }

```

Child components can then call `useAccess()` as usual.

---

## createAccessState (low-level)

For full control without provide/inject, use `createAccessState` directly. It returns a reactive state object without registering it in the injection system.

```typescript

const state = createAccessState(permissionsFromServer)
state.can('delete', 'post') // boolean
state.permissions.value // reactive Ref<PermissionMap>
state.update(newPermissions) // replaces and triggers reactivity
```

This is returned from `createVueAccess()` alongside the other exports. Combine it with your own provide call (e.g. for SSR-specific keys) when the default plugin or `provideAccess` doesn't fit.

---

## ACCESS_INJECTION_KEY

Exported `Symbol` used by `provideAccess`/`useAccess` internally. You can re-use it if you need to bypass the helpers and call `provide(ACCESS_INJECTION_KEY, state)` yourself — for example, when wiring duck-iam into a custom plugin pipeline.

```typescript

const state = createAccessState(permissions)
provide(ACCESS_INJECTION_KEY, state)
```

---

## When to use what

| Need | Use |
| --- | --- |
| Whole-app setup | `createAccessPlugin` + `app.use(plugin)` |
| Component-tree setup (SSR) | `provideAccess` in a parent |
| Compose reactive state outside the tree | `createAccessState` |
| Permission check in template | `useAccess` + `v-if` or `<Can>`/`<Cannot>` |
| Permission check in script | `useAccess` |