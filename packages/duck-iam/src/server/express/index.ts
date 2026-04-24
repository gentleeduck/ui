import type { Engine } from '../../core/engine'
import type { Environment, Policy, Resource, Role } from '../../core/types'
import { extractEnvironment, METHOD_ACTION_MAP } from '../generic'

/** Minimal Express request shape. */
interface Req {
  method?: string
  path?: string
  url?: string
  ip?: string
  params?: Record<string, string>
  headers?: Record<string, string | string[] | undefined>
  body?: unknown
  user?: { id: string; [k: string]: unknown }
  [k: string]: unknown
}
/** Minimal Express response shape. */
interface Res {
  status(code: number): Res
  json(body: unknown): void
}
/** Express next function. */
type Next = (err?: unknown) => void
/** Express middleware function. */
type Middleware = (req: Req, res: Res, next: Next) => void

/** Minimal Express Router interface for admin routes. */
interface ExpressRouterLike {
  get(path: string, handler: (req: Req, res: Res) => void | Promise<void>): void
  put(path: string, handler: (req: Req, res: Res) => void | Promise<void>): void
  post(path: string, handler: (req: Req, res: Res) => void | Promise<void>): void
  delete(path: string, handler: (req: Req, res: Res) => void | Promise<void>): void
}

export interface ExpressOptions<TScope extends string = string> {
  /** Extract the current user ID from the request. */
  getUserId?: (req: Req) => string | null
  /** Derive the target resource from the request. */
  getResource?: (req: Req) => Resource
  /** Derive the action being performed from the request. */
  getAction?: (req: Req) => string
  /** Extract environment context (IP, user-agent, etc.) from the request. */
  getEnvironment?: (req: Req) => Environment
  /** Determine the scope for the access check. */
  getScope?: (req: Req) => TScope | undefined
  /** Custom handler invoked when access is denied. */
  onDenied?: (req: Req, res: Res) => void
  /** Custom error handler for access check failures. */
  onError?: (err: Error, req: Req, res: Res, next: Next) => void
}

/**
 * Global middleware: checks every request against the access engine.
 *
 *   app.use(accessMiddleware(engine, {
 *     getUserId: (req) => req.user?.id,
 *   }));
 */
export function accessMiddleware<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>, opts: ExpressOptions<TScope> = {}): Middleware {
  const {
    getUserId = (req) => req.user?.id ?? null,
    getResource = (req) => {
      const parts = (req.path ?? '/').split('/').filter(Boolean)
      return { type: parts[0] ?? 'root', id: parts[1], attributes: {} }
    },
    getAction = (req) => METHOD_ACTION_MAP[req.method ?? 'GET'] ?? 'read',
    getEnvironment = extractEnvironment,
    getScope,
    onDenied = (_, res) => res.status(403).json({ error: 'Forbidden' }),
    onError = (_err, _, res) => res.status(500).json({ error: 'Internal server error' }),
  } = opts

  return async (req, res, next) => {
    const userId = getUserId(req)
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    try {
      const allowed = await engine.can(
        userId,
        getAction(req) as TAction,
        getResource(req) as Resource<TResource>,
        getEnvironment(req),
        getScope?.(req),
      )
      allowed ? next() : onDenied(req, res)
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)), req, res, next)
    }
  }
}

/**
 * Per-route guard.
 *
 *   app.delete("/posts/:id", guard(engine, "delete", "post"), handler);
 *   app.post("/admin/users", guard(engine, "manage", "user", { scope: "admin" }), handler);
 */
export function guard<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(
  engine: Engine<TAction, TResource, TRole, TScope>,
  action: TAction,
  resourceType: TResource,
  opts: Pick<ExpressOptions<TScope>, 'getUserId' | 'getEnvironment' | 'onDenied'> & { scope?: TScope } = {},
): Middleware {
  const {
    getUserId = (req) => req.user?.id ?? null,
    getEnvironment = extractEnvironment,
    onDenied = (_, res) => res.status(403).json({ error: 'Forbidden' }),
    scope,
  } = opts

  return async (req, res, next) => {
    const userId = getUserId(req)
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    try {
      const allowed = await engine.can(
        userId,
        action,
        { type: resourceType, id: req.params?.id, attributes: {} },
        getEnvironment(req),
        scope,
      )
      allowed ? next() : onDenied(req, res)
    } catch (err) {
      next(err)
    }
  }
}

/**
 * Express router for admin API endpoints.
 * Mount at e.g. /api/access-admin
 *
 *   import { Router } from "express";
 *   app.use("/api/access-admin", adminRouter(engine));
 */
export function adminRouter<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>): (Router: () => ExpressRouterLike) => ExpressRouterLike {
  return (Router: () => ExpressRouterLike) => {
    const router = Router()

    router.get('/policies', async (_: Req, res: Res) => {
      res.json(await engine.admin.listPolicies())
    })

    router.get('/roles', async (_: Req, res: Res) => {
      res.json(await engine.admin.listRoles())
    })

    router.put('/policies', async (req: Req, res: Res) => {
      await engine.admin.savePolicy(req.body as Policy<TAction, TResource, TRole>)
      res.json({ ok: true })
    })

    router.put('/roles', async (req: Req, res: Res) => {
      await engine.admin.saveRole(req.body as Role<TAction, TResource, TRole, TScope>)
      res.json({ ok: true })
    })

    router.post('/subjects/:id/roles', async (req: Req, res: Res) => {
      const body = req.body as Record<string, unknown>
      await engine.admin.assignRole(req.params?.id as string, body.roleId as TRole, body.scope as TScope)
      res.json({ ok: true })
    })

    router.delete('/subjects/:id/roles/:roleId', async (req: Req, res: Res) => {
      await engine.admin.revokeRole(req.params?.id as string, req.params?.roleId as TRole)
      res.json({ ok: true })
    })

    return router
  }
}
