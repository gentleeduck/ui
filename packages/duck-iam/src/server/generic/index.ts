import type { Engine } from '../../core'
import type { Client, Request } from '../../core/types'
/**
 * Builds a server-side permission map for a subject and a list of checks.
 *
 * Call once per request and forward the map to the client.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine to consult.
 * @param subjectId - Identifies the subject whose permissions are computed.
 * @param checks - Lists the permission tuples to evaluate.
 * @param environment - Optional environment context shared across checks.
 * @returns A permission map keyed by `(action, resource, scope)` tuple.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export async function generatePermissionMap<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(
  engine: Engine<TAction, TResource, TRole, TScope>,
  subjectId: string,
  checks: readonly Client.IPermissionCheck<TAction, TResource, TScope>[],
  environment?: Request.IEnvironment,
): Promise<Client.PermissionMap<TAction, TResource, TScope>> {
  return engine.permissions(subjectId, checks, environment)
}

/**
 * Builds a typed `can(action, resourceType, ...)` function bound to a subject.
 *
 * Useful inside request handlers for terse permission checks.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine to consult.
 * @param subjectId - Identifies the subject the returned function checks.
 * @param environment - Optional environment context applied to every check.
 * @returns A `(action, resourceType, resourceId?, scope?) => Promise<boolean>` checker.
 * @example
 * ```ts
 * const can = createSubjectCan(engine, req.user.id)
 * if (await can('delete', 'post')) { ... }
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createSubjectCan<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>, subjectId: string, environment?: Request.IEnvironment) {
  return (action: TAction, resourceType: TResource, resourceId?: string, scope?: TScope) =>
    engine.can(subjectId, action, { type: resourceType, id: resourceId, attributes: {} }, environment, scope)
}

/**
 * Extracts an environment object from common request shapes.
 *
 * Looks at `req.ip`, `x-forwarded-for`, `x-real-ip`, and `user-agent`, and
 * stamps the current timestamp.
 *
 * @param req - Provides any request-like object with `ip` and/or `headers`.
 * @returns The extracted {@link Request.IEnvironment}.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function extractEnvironment(req: {
  ip?: string
  headers?: Record<string, string | string[] | undefined> | Headers
  method?: string
  url?: string
}): Request.IEnvironment {
  const getHeader = (name: string): string | undefined => {
    if (!req.headers) return undefined
    if (req.headers instanceof Headers) return req.headers.get(name) ?? undefined
    const val = (req.headers as Record<string, string | string[] | undefined>)[name]
    return Array.isArray(val) ? val[0] : val
  }

  return {
    ip: req.ip ?? getHeader('x-forwarded-for') ?? getHeader('x-real-ip'),
    userAgent: getHeader('user-agent'),
    timestamp: Date.now(),
  }
}

/**
 * Maps HTTP methods to default access actions used by the framework adapters.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export const METHOD_ACTION_MAP: Readonly<Record<string, string>> = {
  GET: 'read',
  HEAD: 'read',
  OPTIONS: 'read',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'delete',
}
