// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

import type { AuthController } from '../../../../apps/acme-server/src/auth/auth.controller'
import type {
  ForgotPasswordDto,
  GetUserDto,
  ResetPasswordDto,
  SigninDto,
  SignupDto,
  UpdateAccountInformationDto,
  VerifyCodeDto,
} from '../../../../apps/acme-server/src/auth/auth.types'
import type { BlogController } from '../../../../apps/acme-server/src/blog/blog.controller'
import type { CreateBlogDto } from '../../../../apps/acme-server/src/blog/blog.types'
import type { MinioController } from '../../../../apps/acme-server/src/minio/minio.controller'

/** 🦆
 * 🦆 Internal route metadata shape used by ApiRoutes.
 */
type RouteMeta<Body, Query, Params, Headers, Res, Method extends string> = {
  body: Body
  query: Query
  params: Params
  headers: Headers
  res: Res
  method: Method
}

/** 🦆
 * 🦆 Route map: path -> route metadata.
 * 🦆 Example: ApiRoutes['/api/auth/signin']
 */
export interface ApiRoutes {
  '/api/auth/delete-account': RouteMeta<
    GetUserDto,
    never,
    never,
    never,
    Awaited<ReturnType<AuthController['deleteAccount']>>,
    'POST'
  >
  '/api/auth/forgot-password': RouteMeta<
    ForgotPasswordDto,
    never,
    never,
    never,
    Awaited<ReturnType<AuthController['forgotPassword']>>,
    'POST'
  >
  '/api/auth/me': RouteMeta<never, never, never, never, Awaited<ReturnType<AuthController['me']>>, 'GET'>
  '/api/auth/reset-password': RouteMeta<
    ResetPasswordDto,
    never,
    never,
    never,
    Awaited<ReturnType<AuthController['resetPassword']>>,
    'POST'
  >
  '/api/auth/signin': RouteMeta<SigninDto, never, never, never, Awaited<ReturnType<AuthController['signin']>>, 'POST'>
  '/api/auth/signout': RouteMeta<never, never, never, never, Awaited<ReturnType<AuthController['signout']>>, 'GET'>
  '/api/auth/signup': RouteMeta<SignupDto, never, never, never, Awaited<ReturnType<AuthController['signup']>>, 'POST'>
  '/api/auth/update-profile': RouteMeta<
    UpdateAccountInformationDto,
    never,
    never,
    never,
    Awaited<ReturnType<AuthController['updateAccountInformation']>>,
    'POST'
  >
  '/api/auth/verify-code': RouteMeta<
    VerifyCodeDto,
    never,
    never,
    never,
    Awaited<ReturnType<AuthController['verifyEmail']>>,
    'POST'
  >
  '/api/blog/create': RouteMeta<
    CreateBlogDto,
    never,
    never,
    never,
    Awaited<ReturnType<BlogController['createBlog']>>,
    'POST'
  >
  '/api/upload': RouteMeta<never, never, never, never, Awaited<ReturnType<MinioController['upload']>>, 'POST'>
  '/api/upload/:filename': RouteMeta<
    never,
    never,
    { filename: string },
    never,
    Awaited<ReturnType<MinioController['download']>>,
    'GET'
  >
}

/** 🦆
 * 🦆 Lookup helper for a single route entry.
 * 🦆 Example: RouteOf<'/api/auth/signin'>
 */
type RouteOf<P extends keyof ApiRoutes> = ApiRoutes[P]
/** 🦆
 * 🦆 Removes keys with `never` values for cleaner request shapes.
 */
type CleanupNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

/** 🦆
 * 🦆 Union of all route paths.
 */
export type RoutePath = keyof ApiRoutes
/** 🦆
 * 🦆 HTTP method for a given path.
 * 🦆 Example: RouteMethod<'/api/auth/signin'>
 */
export type RouteMethod<P extends RoutePath> = RouteOf<P>['method']
/** 🦆
 * 🦆 Response type for a given path.
 */
export type RouteRes<P extends RoutePath> = RouteOf<P>['res']
/** 🦆
 * 🦆 Request shape for a given path (body/query/params/headers).
 * 🦆 Example: RouteReq<'/api/auth/signin'>
 */
export type RouteReq<P extends RoutePath> = CleanupNever<Pick<RouteOf<P>, 'body' | 'query' | 'params' | 'headers'>>
/** 🦆
 * 🦆 Union of all HTTP methods used by routes.
 */
export type RouteMethods = ApiRoutes[RoutePath]['method']
/** 🦆
 * 🦆 Filters route paths by method.
 * 🦆 Example: PathsByMethod<'GET'>
 */
export type PathsByMethod<M extends RouteMethods> = {
  [P in RoutePath]: RouteMethod<P> extends M ? P : never
}[RoutePath]
/** 🦆
 * 🦆 Fetcher signature for a typed client.
 */
export type DuckFetcher = <P extends RoutePath>(path: P, req: RouteReq<P>) => Promise<RouteRes<P>>
/** 🦆
 * 🦆 Typed client helper with request/byMethod.
 */
export type DuckClient = {
  request: DuckFetcher
  byMethod: <M extends RouteMethods, P extends PathsByMethod<M>>(
    method: M,
    path: P,
    req: RouteReq<P>,
  ) => Promise<RouteRes<P>>
}

/** 🦆
 * 🦆 Body type for a path.
 */
export type GetBody<P extends keyof ApiRoutes> = RouteOf<P>['body']
/** 🦆
 * 🦆 Query type for a path.
 */
export type GetQuery<P extends keyof ApiRoutes> = RouteOf<P>['query']
/** 🦆
 * 🦆 Params type for a path.
 */
export type GetParams<P extends keyof ApiRoutes> = RouteOf<P>['params']
/** 🦆
 * 🦆 Headers type for a path.
 */
export type GetHeaders<P extends keyof ApiRoutes> = RouteOf<P>['headers']
/** 🦆
 * 🦆 Response type for a path.
 */
export type GetRes<P extends keyof ApiRoutes> = RouteOf<P>['res']
/** 🦆
 * 🦆 Request type for a path (alias of RouteReq).
 */
export type GetReq<P extends keyof ApiRoutes> = RouteReq<P>
