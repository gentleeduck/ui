import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { engine } from './engine'
import { useAuth, useCurrentUser } from './auth-context'
import type { AppAction, AppResource, AppScope } from './types'

export interface ICanInput {
  action: AppAction
  resource: { type: AppResource; id?: string; attributes?: Record<string, unknown> }
  scope?: AppScope
}

/**
 * Live ABAC/RBAC decision hook. Cached per (subjectId, action, resource, scope)
 * so render-time gating is cheap. Auto-invalidates on subject switch.
 */
export function useCan(input: ICanInput | null) {
  const { currentUserId } = useAuth()
  const attrFingerprint = input?.resource.attributes ? JSON.stringify(input.resource.attributes) : ''

  const enabled = Boolean(currentUserId && input)
  const query = useQuery({
    queryKey: [
      'iam',
      'can',
      currentUserId,
      input?.action,
      input?.resource.type,
      input?.resource.id,
      input?.scope,
      attrFingerprint,
    ],
    enabled,
    staleTime: 5_000,
    queryFn: async () => {
      if (!currentUserId || !input) return false
      const decision = await engine.can(
        currentUserId,
        input.action,
        { type: input.resource.type, id: input.resource.id, attributes: input.resource.attributes ?? {} } as never,
        input.scope ? ({ scope: input.scope } as never) : undefined,
      )
      if (typeof decision === 'boolean') return decision
      const d = decision as { allowed?: boolean }
      return Boolean(d?.allowed)
    },
  })

  return {
    allowed: query.data === true,
    loading: query.isLoading,
    refetch: query.refetch,
  }
}

/**
 * Conditional render based on `useCan`. Renders nothing while loading; pass
 * `fallback` for explicit deny UI.
 */
export function Authorize({
  action,
  resource,
  scope,
  fallback = null,
  loading = null,
  children,
}: {
  action: AppAction
  resource: { type: AppResource; id?: string; attributes?: Record<string, unknown> }
  scope?: AppScope
  fallback?: React.ReactNode
  loading?: React.ReactNode
  children: React.ReactNode
}) {
  const me = useCurrentUser()
  const effectiveScope = scope ?? me?.workspaceId
  const can = useCan({ action, resource, scope: effectiveScope })
  if (can.loading) return <>{loading}</>
  if (!can.allowed) return <>{fallback}</>
  return <>{children}</>
}

/**
 * Resolve a trace for the current subject + request. Used by the live UI to
 * surface "why denied" hints next to disabled buttons.
 */
export function useExplain(input: ICanInput | null) {
  const { currentUserId } = useAuth()
  const enabled = Boolean(currentUserId && input)
  return useQuery({
    queryKey: ['iam', 'explain', currentUserId, input],
    enabled,
    staleTime: 5_000,
    queryFn: async () => {
      if (!currentUserId || !input) return null
      return engine.explain(
        currentUserId,
        input.action,
        { type: input.resource.type, id: input.resource.id, attributes: input.resource.attributes ?? {} } as never,
        input.scope ? ({ scope: input.scope } as never) : undefined,
      )
    },
  })
}
