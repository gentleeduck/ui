/**
 * Next.js App Router server-side integration.
 *
 * Covers:
 *   - API route wrappers (Route Handlers)
 *   - Server Component helpers
 *   - Next.js Middleware integration
 *   - Permission map generation for client hydration
 */

import type { Engine } from '../../core'
import type { AccessControl, Client, Request } from '../../core/types'
import { METHOD_ACTION_MAP } from '../generic'

/** Next.js route handler context with params. */
type RouteContext = { params: Promise<Record<string, string>> | Record<string, string> }
/** Next.js App Router route handler signature. */
type RouteHandler = (req: Request, ctx: RouteContext) => Promise<Response>

/**
 * Next.js server integration types. Type-only namespace - zero bundle cost.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Next {
  /**
   * Describes options for {@link withAccess}.
   *
   * Every extractor has a sensible default.
   *
   * @template TScope - Constrains valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IWithAccessOptions<TScope extends string = string> {
    /** Extracts the current user ID from the request. */
    getUserId?: (req: Request) => string | null | Promise<string | null>
    /** Extracts environment context (IP, user-agent, etc.) from the request. */
    getEnvironment?: (req: Request) => Request.IEnvironment
    /** Applies a scope to the access check. */
    scope?: TScope
    /** Handles thrown errors during evaluation (defaults to 500 JSON). */
    onError?: (err: Error, req: Request) => Response
  }

  /**
   * Describes options for {@link createNextMiddleware}.
   *
   * `rules` and `getUserId` are required.
   *
   * @template TAction - Constrains valid action strings.
   * @template TResource - Constrains valid resource strings.
   * @template TScope - Constrains valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IMiddlewareOptions<
    TAction extends string = string,
    TResource extends string = string,
    TScope extends string = string,
  > {
    /** Maps URL patterns to required permissions. */
    rules: Array<{
      /** Specifies the regex or string prefix used to match the path. */
      pattern: string | RegExp
      /** Specifies the required action; inferred from HTTP method when omitted. */
      action?: TAction
      /** Specifies the resource type for this route. */
      resource: TResource
      /** Optional scope applied to the check. */
      scope?: TScope
    }>
    /** Extracts the current user ID from the request. */
    getUserId: (req: Request) => string | null | Promise<string | null>
    /** Handles thrown errors during evaluation (defaults to 500 JSON). */
    onError?: (err: Error, req: Request) => Response
  }

  /**
   * Required guard callback for admin Route Handlers.
   *
   * Same threat model as the Express `adminRouter`: any handler that writes
   * policies or roles must be gated.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type IAdminAuthorize = (req: Request) => boolean | Promise<boolean>

  /**
   * Describes options for {@link createAdminHandlers}. `authorize` is required.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAdminOptions {
    /** Required. Runs before every admin handler (read or write). */
    authorize: IAdminAuthorize
    /** Overrides the 401 unauthorized response. */
    onUnauthorized?: (req: Request) => Response
    /** Overrides the 500 internal error response. */
    onError?: (err: Error, req: Request) => Response
  }
}

/**
 * @deprecated Use {@link Next.IWithAccessOptions}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IWithAccessOptions<TScope extends string = string> = Next.IWithAccessOptions<TScope>

/**
 * Wraps a Next.js App Router route handler with an access check.
 *
 * Returns 401 when no user is present, 403 when denied, and otherwise invokes
 * the wrapped handler.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine to consult.
 * @param action - Specifies the action being performed.
 * @param resourceType - Specifies the resource type required for the check.
 * @param handler - Provides the downstream route handler invoked on allow.
 * @param opts - Configures optional extractors and `scope` override.
 * @returns A wrapped route handler.
 * @example
 * ```ts
 * export const DELETE = withAccess(engine, 'delete', 'post', async (req, ctx) => {
 *   const { id } = await ctx.params
 *   return Response.json({ deleted: id })
 * })
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
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
  opts: Next.IWithAccessOptions<TScope> = {},
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

/**
 * Returns whether `subjectId` can perform `(action, resourceType)`.
 *
 * Designed for use inside Server Components or server actions.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine to consult.
 * @param subjectId - Identifies the subject performing the action.
 * @param action - Specifies the action being performed.
 * @param resourceType - Specifies the resource type required for the check.
 * @param resourceId - Optional resource instance ID.
 * @param scope - Optional scope constraint.
 * @returns Resolves to `true` when allowed and `false` otherwise.
 * @author wildduck2 <https://github.com/wildduck2>
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
 * Builds a {@link Client.PermissionMap} for a Server Component or layout.
 *
 * Pass the result to the React `AccessProvider` on the client side.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine to consult.
 * @param subjectId - Identifies the subject whose permissions are computed.
 * @param checks - Lists the permission tuples to evaluate.
 * @returns A permission map keyed by `(action, resource, scope)` tuple.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export async function getPermissions<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(
  engine: Engine<TAction, TResource, TRole, TScope>,
  subjectId: string,
  checks: readonly Client.IPermissionCheck<TAction, TResource, TScope>[],
): Promise<Client.PermissionMap<TAction, TResource, TScope>> {
  return engine.permissions(subjectId, checks)
}

/**
 * @deprecated Use {@link Next.IMiddlewareOptions}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type INextMiddlewareOptions<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> = Next.IMiddlewareOptions<TAction, TResource, TScope>

/**
 * Builds a Next.js Edge Middleware matcher that protects routes by a list of
 * pattern-keyed rules.
 *
 * Returns `null` when the request passes or no rule matches; otherwise returns
 * a `Response` (401/403/500).
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine to consult.
 * @param opts - Provides the rule list, user extractor, and optional error handler.
 * @returns An `async (req) => Response | null` suitable for use inside `middleware.ts`.
 * @example
 * ```ts
 * const mw = createNextMiddleware(engine, {
 *   rules: [{ pattern: '/admin', resource: 'admin' }],
 *   getUserId: (req) => req.headers.get('x-user-id'),
 * })
 * export const middleware = async (req: Request) => (await mw(req)) ?? NextResponse.next()
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createNextMiddleware<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>, opts: Next.IMiddlewareOptions<TAction, TResource, TScope>) {
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

    if (!matchedRule) return null

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

      return null
    } catch (err) {
      return onError(err instanceof Error ? err : new Error(String(err)), req)
    }
  }
}

/**
 * @deprecated Use {@link Next.IAdminAuthorize}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type INextAdminAuthorize = Next.IAdminAuthorize

/**
 * @deprecated Use {@link Next.IAdminOptions}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type INextAdminOptions = Next.IAdminOptions

/**
 * Builds pre-bound admin Route Handlers for Next.js App Router.
 *
 * Every handler runs `authorize(req)` first; failure replies 401. Throws at
 * construction time when `opts.authorize` is missing.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine whose `admin` operations are exposed.
 * @param opts - Must include `authorize`.
 * @returns Object with `listPolicies`, `listRoles`, `savePolicy`, `saveRole`, `assignRole`, `revokeRole`.
 * @throws Error when `opts.authorize` is not a function.
 * @example
 * ```ts
 * // app/api/admin/policies/route.ts
 * const h = createAdminHandlers(engine, { authorize: (req) => isAdminToken(req) })
 * export const GET = h.listPolicies
 * export const PUT = h.savePolicy
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createAdminHandlers<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>, opts: Next.IAdminOptions) {
  if (!opts || typeof opts.authorize !== 'function') {
    throw new Error('[duck-iam] createAdminHandlers requires an `authorize` callback.')
  }
  const { authorize } = opts
  const onUnauthorized = opts.onUnauthorized ?? (() => Response.json({ error: 'Unauthorized' }, { status: 401 }))
  const onError = opts.onError ?? (() => Response.json({ error: 'Internal server error' }, { status: 500 }))

  const gate =
    <P>(fn: (req: Request, ctx: { params: Promise<P> | P }) => Promise<Response>) =>
    async (req: Request, ctx: { params: Promise<P> | P }): Promise<Response> => {
      try {
        if (!(await authorize(req))) return onUnauthorized(req)
        return await fn(req, ctx)
      } catch (err) {
        return onError(err instanceof Error ? err : new Error(String(err)), req)
      }
    }

  return {
    listPolicies: gate(async () => Response.json(await engine.admin.listPolicies())),
    listRoles: gate(async () => Response.json(await engine.admin.listRoles())),
    savePolicy: gate(async (req) => {
      const body = (await req.json()) as AccessControl.IPolicy<TAction, TResource, TRole>
      await engine.admin.savePolicy(body)
      return Response.json({ ok: true })
    }),
    saveRole: gate(async (req) => {
      const body = (await req.json()) as AccessControl.IRole<TAction, TResource, TRole, TScope>
      await engine.admin.saveRole(body)
      return Response.json({ ok: true })
    }),
    assignRole: gate(async (req, ctx) => {
      const params = ctx.params instanceof Promise ? await ctx.params : ctx.params
      const body = (await req.json()) as { roleId: TRole; scope?: TScope }
      await engine.admin.assignRole((params as { id: string }).id, body.roleId, body.scope)
      return Response.json({ ok: true })
    }),
    revokeRole: gate(async (_req, ctx) => {
      const params = ctx.params instanceof Promise ? await ctx.params : ctx.params
      const { id, roleId } = params as { id: string; roleId: string }
      await engine.admin.revokeRole(id, roleId as TRole)
      return Response.json({ ok: true })
    }),
  }
}
