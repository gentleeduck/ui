// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

import type { ResponseType } from '../src/memberships.admin.controller'
import type { MembershipsAdminGetDto } from '../src/memberships.types'

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
  '/v1/admin/memberships/:id': RouteMeta<
    never,
    MembershipsAdminGetDto,
    { id: string },
    never,
    | {
        ok: false
        error: {
          code: 'MEMBERSHIPS_GET_SUCCESS' | 'MEMBERSHIP_NOT_FOUND' | 'MEMBERSHIPS_GET_FAILED'
          cause?: unknown
          issues?: readonly string[]
        }
      }
    | {
        ok: true
        data: {
          id: string
          createdAt: Date
          updatedAt: Date
          deletedAt: Date | null
          tenantId: string
          status: 'active' | 'invited' | 'suspended'
          userId: string
        }
        code: 'MEMBERSHIPS_GET_SUCCESS' | 'MEMBERSHIP_NOT_FOUND' | 'MEMBERSHIPS_GET_FAILED'
      },
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
 * 🦆 Lookup helper for a route entry by method.
 * 🦆 Example: RouteOfMethod<'/api/auth/signin', 'POST'>
 */

type RouteOfMethod<P extends keyof ApiRoutes, M extends RouteMethods> = Extract<RouteOf<P>, { method: M }>
/** 🦆
 * 🦆 Response type for a given path and method.
 */

export type RouteResMethod<P extends RoutePath, M extends RouteMethods> = RouteOfMethod<P, M>['res']
/** 🦆
 * 🦆 Request shape for a given path and method.
 * 🦆 Example: RouteReqMethod<'/api/auth/signin', 'POST'>
 */

export type RouteReqMethod<P extends RoutePath, M extends RouteMethods> = CleanupNever<
  Pick<RouteOfMethod<P, M>, 'body' | 'query' | 'params' | 'headers'>
>
/** 🦆
 * 🦆 Filters route paths by method.
 * 🦆 Example: PathsByMethod<'GET'>
 */

export type PathsByMethod<M extends RouteMethods> = {
  [P in RoutePath]: M extends RouteMethod<P> ? P : never
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
    req: RouteReqMethod<P, M>,
  ) => Promise<RouteResMethod<P, M>>
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
