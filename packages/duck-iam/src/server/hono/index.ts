import type { Engine } from '../../core/engine'
import type { Environment, Resource } from '../../core/types'
import { METHOD_ACTION_MAP } from '../generic'

/** Minimal Hono context shape. */
interface HonoContext {
  req: {
    method: string
    path: string
    url: string
    header(name: string): string | undefined
    param(name: string): string | undefined
  }
  get(key: string): unknown
  set(key: string, value: unknown): void
  json(data: unknown, status?: number): Response
  text(data: string, status?: number): Response
}
/** Hono next function. */
type HonoNext = () => Promise<void>
/** Hono middleware function. */
type HonoMiddleware = (c: HonoContext, next: HonoNext) => Promise<Response | undefined>

export interface HonoOptions<TScope extends string = string> {
  /** Extract the current user ID from the context. */
  getUserId?: (c: HonoContext) => string | null
  /** Derive the target resource from the context. */
  getResource?: (c: HonoContext) => Resource
  /** Derive the action being performed from the context. */
  getAction?: (c: HonoContext) => string
  /** Extract environment context (IP, user-agent, etc.) from the context. */
  getEnvironment?: (c: HonoContext) => Environment
  /** Determine the scope for the access check. */
  getScope?: (c: HonoContext) => TScope | undefined
  /** Custom handler invoked when access is denied. */
  onDenied?: (c: HonoContext) => Response
  /** Custom error handler for access check failures. */
  onError?: (err: Error, c: HonoContext) => Response
}

/** Extract environment from Hono context using common headers. */
function defaultEnv(c: HonoContext): Environment {
  return {
    ip: c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for'),
    userAgent: c.req.header('user-agent'),
    timestamp: Date.now(),
  }
}

/**
 * Global middleware for Hono.
 */
export function accessMiddleware<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>, opts: HonoOptions<TScope> = {}): HonoMiddleware {
  const {
    getUserId = (c) => (c.get('userId') as string | undefined) ?? c.req.header('x-user-id') ?? null,
    getResource = (c) => {
      const parts = c.req.path.split('/').filter(Boolean)
      return { type: parts[0] ?? 'root', id: parts[1], attributes: {} }
    },
    getAction = (c) => METHOD_ACTION_MAP[c.req.method] ?? 'read',
    getEnvironment = defaultEnv,
    getScope,
    onDenied = (c) => c.json({ error: 'Forbidden' }, 403),
    onError = (_err, c) => c.json({ error: 'Internal server error' }, 500),
  } = opts

  return async (c, next) => {
    const userId = getUserId(c)
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    try {
      const allowed = await engine.can(
        userId,
        getAction(c) as TAction,
        getResource(c) as Resource<TResource>,
        getEnvironment(c),
        getScope?.(c),
      )

      if (!allowed) return onDenied(c)
      await next()
    } catch (err) {
      return onError(err instanceof Error ? err : new Error(String(err)), c)
    }
  }
}

/**
 * Per-route guard for Hono.
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
  opts: Pick<HonoOptions<TScope>, 'getUserId' | 'getEnvironment' | 'onDenied' | 'onError'> & { scope?: TScope } = {},
): HonoMiddleware {
  const {
    getUserId = (c) => (c.get('userId') as string | undefined) ?? c.req.header('x-user-id') ?? null,
    getEnvironment = defaultEnv,
    onDenied = (c) => c.json({ error: 'Forbidden' }, 403),
    onError = (_err, c) => c.json({ error: 'Internal server error' }, 500),
    scope,
  } = opts

  return async (c, next) => {
    const userId = getUserId(c)
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    try {
      const allowed = await engine.can(
        userId,
        action,
        { type: resourceType, id: c.req.param('id'), attributes: {} },
        getEnvironment(c),
        scope,
      )

      if (!allowed) return onDenied(c)
      await next()
    } catch (err) {
      return onError(err instanceof Error ? err : new Error(String(err)), c)
    }
  }
}
