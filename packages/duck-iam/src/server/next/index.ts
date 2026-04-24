/**
 * Next.js App Router server-side integration.
 *
 * Covers:
 *   - API route wrappers (Route Handlers)
 *   - Server Component helpers
 *   - Next.js Middleware integration
 *   - Permission map generation for client hydration
 */

import type { Engine } from '../../core/engine'
import type { Environment, PermissionCheck, PermissionMap } from '../../core/types'
import { METHOD_ACTION_MAP } from '../generic'

// ------------------------------------------------------------
// API Route Handler wrapper
// ------------------------------------------------------------

/** Next.js route handler context with params. */
type RouteContext = { params: Promise<Record<string, string>> | Record<string, string> }
/** Next.js App Router route handler signature. */
type RouteHandler = (req: Request, ctx: RouteContext) => Promise<Response>

export interface WithAccessOptions<TScope extends string = string> {
  /** Extract the current user ID from the request. */
  getUserId?: (req: Request) => string | null | Promise<string | null>
  /** Extract environment context (IP, user-agent, etc.) from the request. */
  getEnvironment?: (req: Request) => Environment
  /** Scope to apply for the access check. */
  scope?: TScope
  /** Custom error handler for access check failures. */
  onError?: (err: Error, req: Request) => Response
}

/**
 * Wrap a Next.js App Router route handler with access control.
 */
export function withAccess<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(
  engine: Engine<TAction, TResource, TRole, TScope>,
  action: TAction,
  resourceType: TResource,
  handler: RouteHandler,
  opts: WithAccessOptions<TScope> = {},
): RouteHandler {
  const {
    getUserId = (req) => req.headers.get('x-user-id'),
    getEnvironment = (req) => ({
      ip: req.headers.get('x-forwarded-for') ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
      timestamp: Date.now(),
    }),
    scope,
    onError = () => Response.json({ error: 'Internal server error' }, { status: 500 }),
  } = opts

  return async (req, ctx) => {
    const userId = await getUserId(req)
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const params = ctx.params instanceof Promise ? await ctx.params : ctx.params
      const resourceId = params?.id

      const allowed = await engine.can(
        userId,
        action,
        { type: resourceType, id: resourceId, attributes: {} },
        getEnvironment(req),
        scope,
      )

      if (!allowed) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      return handler(req, ctx)
    } catch (err) {
      return onError(err instanceof Error ? err : new Error(String(err)), req)
    }
  }
}

// ------------------------------------------------------------
// Server Component helpers
// ------------------------------------------------------------

/**
 * Check a single permission in a Server Component or server action.
 */
export async function checkAccess<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(
  engine: Engine<TAction, TResource, TRole, TScope>,
  subjectId: string,
  action: TAction,
  resourceType: TResource,
  resourceId?: string,
  scope?: TScope,
): Promise<boolean> {
  return engine.can(
    subjectId,
    action,
    {
      type: resourceType,
      id: resourceId,
      attributes: {},
    },
    undefined,
    scope,
  )
}

/**
 * Generate a PermissionMap in a Server Component or layout.
 * Pass this to the AccessProvider on the client side.
 */
export async function getPermissions<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(
  engine: Engine<TAction, TResource, TRole, TScope>,
  subjectId: string,
  checks: readonly PermissionCheck<TAction, TResource, TScope>[],
): Promise<PermissionMap<TAction, TResource, TScope>> {
  return engine.permissions(subjectId, checks)
}

// ------------------------------------------------------------
// Next.js Middleware integration
// ------------------------------------------------------------

export interface NextMiddlewareOptions<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> {
  /** Map URL patterns to required permissions */
  rules: Array<{
    /** Regex or glob pattern for the path */
    pattern: string | RegExp
    /** Required action. If not set, inferred from HTTP method. */
    action?: TAction
    /** Resource type for this route */
    resource: TResource
    /** Optional scope for this route */
    scope?: TScope
  }>
  /** Extract the current user ID from the request. */
  getUserId: (req: Request) => string | null | Promise<string | null>
  /** Custom error handler for access check failures. */
  onError?: (err: Error, req: Request) => Response
}

/**
 * Create a matcher function for Next.js middleware.
 * Use in middleware.ts to protect routes at the edge.
 */
export function createNextMiddleware<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>, opts: NextMiddlewareOptions<TAction, TResource, TScope>) {
  const { onError = () => Response.json({ error: 'Internal server error' }, { status: 500 }) } = opts

  return async (req: Request): Promise<Response | null> => {
    const url = new URL(req.url)
    const path = url.pathname

    const matchedRule = opts.rules.find((r) => {
      if (typeof r.pattern === 'string') {
        return path.startsWith(r.pattern)
      }
      return r.pattern.test(path)
    })

    if (!matchedRule) return null // No rule matches, allow through

    const userId = await opts.getUserId(req)
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const action = matchedRule.action ?? (METHOD_ACTION_MAP[req.method] as TAction) ?? ('read' as TAction)

      const allowed = await engine.can(
        userId,
        action,
        {
          type: matchedRule.resource,
          attributes: {},
        },
        undefined,
        matchedRule.scope,
      )

      if (!allowed) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      return null // Allow through
    } catch (err) {
      return onError(err instanceof Error ? err : new Error(String(err)), req)
    }
  }
}
