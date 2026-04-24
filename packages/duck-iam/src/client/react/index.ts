/**
 * React integration for duck-iam.
 *
 * Two patterns:
 *   1. Server-driven (recommended): generate PermissionMap on server, pass to client
 *   2. Client-evaluated: load Engine on client with HttpAdapter or MemoryAdapter
 *
 * Usage (server-driven):
 *
 *   // Server (Next.js layout, RSC, or API):
 *   const perms = await engine.permissions(userId, [
 *     { action: "create", resource: "post" },
 *     { action: "delete", resource: "post" },
 *     { action: "manage", resource: "team" },
 *   ]);
 *
 *   // Client:
 *   <AccessProvider permissions={perms}>
 *     <App />
 *   </AccessProvider>
 *
 *   // In any component:
 *   const { can } = useAccess();
 *   if (can("delete", "post")) { ... }
 *   if (can("manage", "user", undefined, "admin")) { ... }
 *
 *   // Or declaratively:
 *   <Can action="manage" resource="team">
 *     <AdminPanel />
 *   </Can>
 */

import type { ReactNode } from 'react'
import type { PermissionMap } from '../../core/types'
import { buildPermissionKey } from '../../shared/keys'

// We export factory functions so React is a peer dependency, not a hard one.
// The consuming app calls these with their React import.

// ------------------------------------------------------------
// Minimal React API surface -- matches React 18+ / 19
// ------------------------------------------------------------

/** Minimal React context type. */
interface ReactContext<_T> {
  Provider: unknown
}

/** Minimal React API surface for dependency injection. */
interface ReactLike {
  createContext<T>(defaultValue: T): ReactContext<T>
  useContext<T>(context: ReactContext<T>): T
  useMemo<T>(factory: () => T, deps: readonly unknown[]): T
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- matches React's own useCallback<T extends Function>
  useCallback<T extends Function>(callback: T, deps: readonly unknown[]): T
  createElement(type: unknown, props: Record<string, unknown> | null, ...children: ReactNode[]): ReactNode
  useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void]
  useEffect(effect: () => undefined | (() => void), deps?: readonly unknown[]): void
}

// ------------------------------------------------------------
// Context + Provider
// ------------------------------------------------------------

export interface AccessContextValue<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> {
  /** The resolved permission map. */
  permissions: PermissionMap<TAction, TResource, TScope>
  /** Returns `true` if the given action/resource combination is allowed. */
  can: (action: TAction, resource: TResource, resourceId?: string, scope?: TScope) => boolean
  /** Returns `true` if the given action/resource combination is denied. */
  cannot: (action: TAction, resource: TResource, resourceId?: string, scope?: TScope) => boolean
}

/**
 * Create the full React access control system.
 * Call once at app init, export the results.
 *
 *   // lib/access.tsx
 *   import React from "react";
 *   import { createAccessControl } from "duck-iam/client/react";
 *
 *   export const { AccessProvider, useAccess, Can, Cannot } = createAccessControl(React);
 */
export function createAccessControl<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
>(React: ReactLike) {
  const { createContext, useContext, useMemo, useCallback } = React

  const AccessContext = createContext({
    permissions: {} as PermissionMap<TAction, TResource, TScope>,
    can: () => false,
    cannot: () => true,
  } as AccessContextValue<TAction, TResource, TScope>)

  // -- Provider --

  /** Context provider component that supplies permission data to the tree. */
  function AccessProvider({
    permissions,
    children,
  }: {
    permissions: PermissionMap<TAction, TResource, TScope>
    children: ReactNode
  }): ReactNode {
    const value = useMemo(() => {
      const can = (action: TAction, resource: TResource, resourceId?: string, scope?: TScope): boolean => {
        const key = buildPermissionKey(action, resource, resourceId, scope)
        return (permissions as Record<string, boolean>)[key] ?? false
      }

      return {
        permissions,
        can,
        cannot: (a: TAction, r: TResource, id?: string, s?: TScope) => !can(a, r, id, s),
      }
    }, [permissions])

    return React.createElement(AccessContext.Provider, { value }, children)
  }

  // -- Hook --

  /** Hook to access the permission context. */
  function useAccess(): AccessContextValue<TAction, TResource, TScope> {
    return useContext(AccessContext)
  }

  // -- Declarative components --

  /** Declarative component that renders children only when the permission is granted. */
  function Can({
    action,
    resource,
    resourceId,
    scope,
    children,
    fallback = null,
  }: {
    action: TAction
    resource: TResource
    resourceId?: string
    scope?: TScope
    children: ReactNode
    fallback?: ReactNode
  }): ReactNode {
    const { can } = useAccess()
    return can(action, resource, resourceId, scope) ? children : fallback
  }

  /** Declarative component that renders children only when the permission is denied. */
  function Cannot({
    action,
    resource,
    resourceId,
    scope,
    children,
  }: {
    action: TAction
    resource: TResource
    resourceId?: string
    scope?: TScope
    children: ReactNode
  }): ReactNode {
    const { cannot } = useAccess()
    return cannot(action, resource, resourceId, scope) ? children : null
  }

  // -- Utility hook: fetch permissions from server --

  /** Hook to asynchronously fetch permissions from a server endpoint. */
  function usePermissions(
    fetchFn: () => Promise<PermissionMap<TAction, TResource, TScope>>,
    deps: readonly unknown[] = [],
  ) {
    const [permissions, setPermissions] = React.useState({} as PermissionMap<TAction, TResource, TScope>)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null as Error | null)

    React.useEffect(() => {
      let cancelled = false
      setLoading(true)
      fetchFn()
        .then((perms: PermissionMap<TAction, TResource, TScope>) => {
          if (!cancelled) {
            setPermissions(perms)
            setLoading(false)
          }
        })
        .catch((err: Error) => {
          if (!cancelled) {
            setError(err)
            setLoading(false)
          }
        })
      return () => {
        cancelled = true
      }
    }, deps)

    const can = useCallback(
      (action: TAction, resource: TResource, resourceId?: string, scope?: TScope) => {
        const key = buildPermissionKey(action, resource, resourceId, scope)
        return (permissions as Record<string, boolean>)[key] ?? false
      },
      [permissions],
    )

    return { permissions, can, loading, error }
  }

  return {
    AccessContext,
    AccessProvider,
    useAccess,
    usePermissions,
    Can,
    Cannot,
  }
}

/**
 * Standalone permission checker (no React context needed).
 * Useful for one-off checks or non-React code.
 */
export function createPermissionChecker<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
>(permissions: PermissionMap<TAction, TResource, TScope>) {
  const can = (action: TAction, resource: TResource, resourceId?: string, scope?: TScope): boolean => {
    const key = buildPermissionKey(action, resource, resourceId, scope)
    return (permissions as Record<string, boolean>)[key] ?? false
  }

  return {
    can,
    cannot: (action: TAction, resource: TResource, resourceId?: string, scope?: TScope): boolean => {
      return !can(action, resource, resourceId, scope)
    },
    permissions,
  }
}
