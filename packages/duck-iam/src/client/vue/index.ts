/**
 * Vue 3 integration for duck-iam.
 *
 * Usage:
 *
 *   // Plugin setup (main.ts):
 *   import { createAccessPlugin } from "duck-iam/client/vue";
 *   app.use(createAccessPlugin(permissionMap));
 *
 *   // In components:
 *   import { useAccess } from "duck-iam/client/vue";
 *
 *   const { can, cannot } = useAccess();
 *   const canDelete = can("delete", "post");
 *   const canManage = can("manage", "user", undefined, "admin");
 *
 *   // Template directive:
 *   <button v-if="can('delete', 'post')">Delete</button>
 */

import type { PermissionMap } from '../../core/types'
import { buildPermissionKey } from '../../shared/keys'

/** Vue injection key for the access control state. */
export const ACCESS_INJECTION_KEY = Symbol('duck-iam')

// -- Minimal Vue 3 API surface -- no hard dependency on vue --

/** Minimal Vue ref type. */
interface VueRef<T> {
  value: T
}

/** Minimal Vue virtual node type. */
interface VNode {
  [key: string]: unknown
}

/** Minimal Vue API surface for dependency injection. */
interface VueLike {
  ref<T>(value: T): VueRef<T>
  computed<T>(getter: () => T): Readonly<VueRef<T>>
  inject<T>(key: symbol | string): T | undefined
  provide(key: symbol | string, value: unknown): void
  defineComponent(options: Record<string, unknown>): unknown
  h(type: unknown, props?: Record<string, unknown> | null, children?: unknown): VNode
}

/** Minimal Vue application instance type. */
interface VueApp {
  provide(key: symbol | string, value: unknown): void
  config: { globalProperties: Record<string, unknown> }
}

/**
 * Create the Vue access control system.
 * Pass your Vue's reactive utilities to avoid hard dependency.
 *
 *   import { ref, computed, inject, provide } from "vue";
 *   import { createVueAccess } from "duck-iam/client/vue";
 *
 *   export const { useAccess, provideAccess, createAccessPlugin } = createVueAccess({
 *     ref, computed, inject, provide,
 *   });
 */
export function createVueAccess<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
>(vue: VueLike) {
  const { ref, inject, provide, defineComponent } = vue

  /** Create reactive access control state with can/cannot helpers. */
  function createAccessState(initialPermissions: PermissionMap<TAction, TResource, TScope>) {
    const permissions = ref(initialPermissions as PermissionMap<TAction, TResource, TScope>)

    const can = (action: TAction, resource: TResource, resourceId?: string, scope?: TScope): boolean => {
      const key = buildPermissionKey(action, resource, resourceId, scope)
      return (permissions.value as Record<string, boolean>)[key] ?? false
    }

    const cannot = (action: TAction, resource: TResource, resourceId?: string, scope?: TScope): boolean => {
      return !can(action, resource, resourceId, scope)
    }

    const update = (newPerms: PermissionMap<TAction, TResource, TScope>) => {
      permissions.value = newPerms
    }

    return { permissions, can, cannot, update }
  }

  /** Provide access control state to child components via Vue's provide/inject. */
  function provideAccess(permissions: PermissionMap<TAction, TResource, TScope>) {
    const state = createAccessState(permissions)
    provide(ACCESS_INJECTION_KEY, state)
    return state
  }

  /** Composable to access the permission state from a parent provider. */
  function useAccess() {
    const state = inject(ACCESS_INJECTION_KEY)
    if (!state) {
      throw new Error(
        'duck-iam: useAccess() called without provideAccess(). ' +
          'Use provideAccess() in a parent component or install the plugin.',
      )
    }
    return state as ReturnType<typeof createAccessState>
  }

  /** Create a Vue plugin that installs access control globally. */
  function createAccessPlugin(permissions: PermissionMap<TAction, TResource, TScope>) {
    return {
      install(app: VueApp) {
        const state = createAccessState(permissions)
        app.provide(ACCESS_INJECTION_KEY, state)

        // Make can/cannot available globally
        app.config.globalProperties.$can = state.can
        app.config.globalProperties.$cannot = state.cannot
      },
    }
  }

  /**
   * Declarative component: renders slot content only when permission is granted.
   *
   *   <Can action="delete" resource="post">
   *     <button>Delete</button>
   *   </Can>
   *
   *   <Can action="read" resource="analytics">
   *     <template #default>Analytics</template>
   *     <template #fallback>Upgrade to Pro</template>
   *   </Can>
   */
  const Can = defineComponent({
    name: 'Can',
    props: {
      action: { type: String, required: true },
      resource: { type: String, required: true },
      resourceId: { type: String, default: undefined },
      scope: { type: String, default: undefined },
    },
    setup(
      props: { action: string; resource: string; resourceId?: string; scope?: string },
      { slots }: { slots: Record<string, (() => VNode[]) | undefined> },
    ) {
      // biome-ignore lint/correctness/useHookAtTopLevel: this is a declarative component
      const { can } = useAccess()
      return () => {
        if (can(props.action as TAction, props.resource as TResource, props.resourceId, props.scope as TScope)) {
          return slots.default?.()
        }
        return slots.fallback?.()
      }
    },
  })

  /**
   * Declarative component: renders slot content only when permission is denied.
   *
   *   <Cannot action="read" resource="analytics">
   *     <div>Upgrade to access this feature</div>
   *   </Cannot>
   */
  const Cannot = defineComponent({
    name: 'Cannot',
    props: {
      action: { type: String, required: true },
      resource: { type: String, required: true },
      resourceId: { type: String, default: undefined },
      scope: { type: String, default: undefined },
    },
    setup(
      props: { action: string; resource: string; resourceId?: string; scope?: string },
      { slots }: { slots: Record<string, (() => VNode[]) | undefined> },
    ) {
      // biome-ignore lint/correctness/useHookAtTopLevel: this is a declarative component
      const { cannot } = useAccess()
      return () => {
        if (cannot(props.action as TAction, props.resource as TResource, props.resourceId, props.scope as TScope)) {
          return slots.default?.()
        }
        return null
      }
    },
  })

  return {
    createAccessState,
    provideAccess,
    useAccess,
    createAccessPlugin,
    Can,
    Cannot,
    ACCESS_INJECTION_KEY,
  }
}
