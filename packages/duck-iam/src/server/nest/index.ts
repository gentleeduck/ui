import type { Engine } from '../../core'
import type { AccessControl, Request } from '../../core/types'
import { extractEnvironment, METHOD_ACTION_MAP } from '../generic'

// Reflect.defineMetadata/getMetadata come from reflect-metadata (used by NestJS)
declare namespace Reflect {
  function defineMetadata(key: string, value: unknown, target: object): void
  function getMetadata(key: string, target: object): unknown
}

// NestJS is a peer dep; these are the minimum shapes the guard touches.

/** Minimal NestJS request shape. */
interface NestRequest {
  user?: { id?: string; sub?: string; [key: string]: unknown }
  params?: Record<string, string>
  method: string
  path?: string
  route?: { path?: string }
  headers?: Record<string, string | string[] | undefined>
  ip?: string
  [key: string]: unknown
}

/** Minimal NestJS execution context. */
interface NestExecutionContext {
  switchToHttp(): { getRequest(): NestRequest }
  // NestJS returns Function; we use `object` as the compatible supertype.
  getHandler(): object
}

/** Metadata key for the @Authorize decorator. */
export const ACCESS_METADATA_KEY = 'duck-iam:authorize'

/**
 * NestJS server integration types. Type-only namespace - zero bundle cost.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Nest {
  /**
   * Describes the metadata payload attached by the {@link Authorize} decorator.
   *
   * @template TAction - Constrains valid action strings.
   * @template TResource - Constrains valid resource strings.
   * @template TScope - Constrains valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAuthorizeMeta<
    TAction extends string = string,
    TResource extends string = string,
    TScope extends string = string,
  > {
    /** Specifies the required action (e.g. `'delete'`, `'manage'`). */
    action?: TAction
    /** Specifies the target resource type (e.g. `'post'`, `'user'`). */
    resource?: TResource
    /** Optional scope constraint applied to the check. */
    scope?: TScope
    /** When `true`, infers action from HTTP method and resource from route path. */
    infer?: boolean
  }

  /**
   * Describes options for {@link nestAccessGuard}.
   *
   * Each extractor has a sensible default.
   *
   * @template TScope - Constrains valid scope strings.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IGuardOptions<TScope extends string = string> {
    /** Extracts the current user ID from the request. */
    getUserId?: (request: NestRequest) => string | null
    /** Extracts environment context (IP, user-agent, etc.) from the request. */
    getEnvironment?: (request: NestRequest) => Request.IEnvironment
    /** Extracts the resource ID from the request. */
    getResourceId?: (request: NestRequest) => string | undefined
    /** Determines the scope used for the access check. */
    getScope?: (request: NestRequest) => TScope | undefined
    /** Handles thrown errors during evaluation; return `true` to allow, `false` to deny. */
    onError?: (err: Error, request: NestRequest) => boolean
  }

  /**
   * Required guard callback for the admin controller methods.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type IAdminAuthorize = (request: NestRequest) => boolean | Promise<boolean>

  /**
   * Describes options for {@link createAdminOperations}. `authorize` is required.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IAdminOptions {
    /** Required. Runs before every admin operation. */
    authorize: IAdminAuthorize
  }
}

/**
 * @deprecated Use {@link Nest.IAuthorizeMeta}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type IAuthorizeMeta<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
> = Nest.IAuthorizeMeta<TAction, TResource, TScope>

/** Handler function with attached authorize metadata. */
interface HandlerWithMeta {
  __accessMeta?: Nest.IAuthorizeMeta
}

/**
 * Marks a controller method with access requirements.
 *
 * Stores metadata via `reflect-metadata` when available and also attaches
 * `__accessMeta` so the guard works without that package.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TScope - Constrains valid scope strings.
 * @param meta - Configures the access metadata; defaults to `{ infer: true }`.
 * @returns A NestJS `MethodDecorator`.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function Authorize<
  TAction extends string = string,
  TResource extends string = string,
  TScope extends string = string,
>(
  meta: Nest.IAuthorizeMeta<TAction, TResource, TScope> = { infer: true } as Nest.IAuthorizeMeta<
    TAction,
    TResource,
    TScope
  >,
): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    if (Reflect?.defineMetadata) {
      Reflect.defineMetadata(ACCESS_METADATA_KEY, meta, descriptor.value as object)
    }
    if (descriptor.value != null) {
      Object.defineProperty(descriptor.value, '__accessMeta', { value: meta, configurable: true, writable: true })
    }
    return descriptor
  }
}

/**
 * @deprecated Use {@link Nest.IGuardOptions}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type INestGuardOptions<TScope extends string = string> = Nest.IGuardOptions<TScope>

/** Extract authorize metadata from a handler. */
function getHandlerMeta(handler: object): Nest.IAuthorizeMeta | undefined {
  if ('__accessMeta' in handler) {
    return (handler as HandlerWithMeta).__accessMeta
  }
  if (Reflect?.getMetadata) {
    return Reflect.getMetadata(ACCESS_METADATA_KEY, handler) as Nest.IAuthorizeMeta | undefined
  }
  return undefined
}

/**
 * Builds a NestJS `canActivate` function that reads {@link Authorize} metadata
 * off the handler and runs `engine.can(...)`.
 *
 * Handlers without metadata pass through (allow).
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine to consult.
 * @param opts - Configures optional extractors and error handler.
 * @returns A function suitable as a NestJS guard's `canActivate` body.
 * @example
 * ```ts
 * @Injectable()
 * class AccessGuard implements CanActivate {
 *   canActivate = nestAccessGuard(engine)
 * }
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function nestAccessGuard<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>, opts: Nest.IGuardOptions<TScope> = {}) {
  const {
    getUserId = (req: NestRequest) => (req.user?.id as string) ?? (req.user?.sub as string) ?? null,
    getEnvironment = (req: NestRequest) => extractEnvironment(req),
    getResourceId = (req: NestRequest) => req.params?.id,
    getScope,
    onError = () => false,
  } = opts

  return async (context: NestExecutionContext): Promise<boolean> => {
    const request = context.switchToHttp().getRequest()
    const handler = context.getHandler()

    const meta = getHandlerMeta(handler)

    if (!meta) return true // No @Authorize decorator: allow.

    const userId = getUserId(request)
    if (!userId) return false

    const action = meta.infer ? (METHOD_ACTION_MAP[request.method] ?? 'read') : (meta.action ?? 'read')

    const resource = meta.infer ? inferResource(request) : (meta.resource ?? 'unknown')

    const scope = (meta.scope as TScope | undefined) ?? getScope?.(request)

    try {
      return await engine.can(
        userId,
        action as TAction,
        { type: resource as TResource, id: getResourceId(request), attributes: {} },
        getEnvironment(request),
        scope,
      )
    } catch (err) {
      return onError(err instanceof Error ? err : new Error(String(err)), request)
    }
  }
}

/** Infer resource type from request route path. */
function inferResource(request: NestRequest): string {
  const path: string = request.route?.path ?? request.path ?? '/'
  const segments = path.split('/').filter((s: string) => s && !s.startsWith(':'))
  return segments[segments.length - 1] ?? 'root'
}

/**
 * Builds a pre-typed `Authorize` decorator constrained to your app's
 * action/resource/scope unions.
 *
 * Typos like `@Authorize({ action: 'craete' })` become compile errors.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TScope - Constrains valid scope strings.
 * @returns A typed wrapper around {@link Authorize}.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createTypedAuthorize<
  TAction extends string,
  TResource extends string,
  TScope extends string = string,
>() {
  return Authorize as (meta?: Nest.IAuthorizeMeta<TAction, TResource, TScope>) => MethodDecorator
}

/** DI token for the access Engine in NestJS. */
export const ACCESS_ENGINE_TOKEN = 'ACCESS_ENGINE'

/**
 * Builds a NestJS provider descriptor bound to {@link ACCESS_ENGINE_TOKEN}.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param factory - Provides the sync or async engine factory.
 * @returns A `{ provide, useFactory }` descriptor for NestJS DI.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createEngineProvider<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(factory: () => Engine<TAction, TResource, TRole, TScope> | Promise<Engine<TAction, TResource, TRole, TScope>>) {
  return {
    provide: ACCESS_ENGINE_TOKEN,
    useFactory: factory,
  }
}

/**
 * @deprecated Use {@link Nest.IAdminAuthorize}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type INestAdminAuthorize = Nest.IAdminAuthorize

/**
 * @deprecated Use {@link Nest.IAdminOptions}. Will be removed in 3.0.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type INestAdminOptions = Nest.IAdminOptions

/**
 * Builds framework-agnostic admin operations for use inside a NestJS controller.
 *
 * Nest's decorator-driven routing means we do not ship a router factory;
 * instead this returns a record of admin handlers the user wires into their
 * `@Controller` methods. Enforces `authorize` at construction time so the
 * controller cannot be instantiated unguarded.
 *
 * @template TAction - Constrains valid action strings.
 * @template TResource - Constrains valid resource strings.
 * @template TRole - Constrains valid role strings.
 * @template TScope - Constrains valid scope strings.
 * @param engine - Provides the access engine whose `admin` operations are exposed.
 * @param opts - Must include `authorize`.
 * @returns A record of `(req, ...args) => Promise` admin handlers.
 * @throws Error when `opts.authorize` is not a function.
 * @example
 * ```ts
 * @Controller('admin')
 * class IamAdminController {
 *   private h = createAdminOperations(engine, { authorize: (req) => isAdmin(req.user) })
 *   @Get('policies') listPolicies(@Req() req) { return this.h.listPolicies(req) }
 * }
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createAdminOperations<
  TAction extends string = string,
  TResource extends string = string,
  TRole extends string = string,
  TScope extends string = string,
>(engine: Engine<TAction, TResource, TRole, TScope>, opts: Nest.IAdminOptions) {
  if (!opts || typeof opts.authorize !== 'function') {
    throw new Error('[duck-iam] createAdminOperations requires an `authorize` callback.')
  }
  const { authorize } = opts

  const gate = async (req: NestRequest): Promise<void> => {
    if (!(await authorize(req))) {
      const err = new Error('Unauthorized') as Error & { status?: number }
      err.status = 401
      throw err
    }
  }

  return {
    async listPolicies(req: NestRequest) {
      await gate(req)
      return engine.admin.listPolicies()
    },
    async listRoles(req: NestRequest) {
      await gate(req)
      return engine.admin.listRoles()
    },
    async savePolicy(req: NestRequest, body: AccessControl.IPolicy<TAction, TResource, TRole>) {
      await gate(req)
      await engine.admin.savePolicy(body)
      return { ok: true }
    },
    async saveRole(req: NestRequest, body: AccessControl.IRole<TAction, TResource, TRole, TScope>) {
      await gate(req)
      await engine.admin.saveRole(body)
      return { ok: true }
    },
    async assignRole(req: NestRequest, subjectId: string, body: { roleId: TRole; scope?: TScope }) {
      await gate(req)
      await engine.admin.assignRole(subjectId, body.roleId, body.scope)
      return { ok: true }
    },
    async revokeRole(req: NestRequest, subjectId: string, roleId: TRole) {
      await gate(req)
      await engine.admin.revokeRole(subjectId, roleId)
      return { ok: true }
    },
  }
}
