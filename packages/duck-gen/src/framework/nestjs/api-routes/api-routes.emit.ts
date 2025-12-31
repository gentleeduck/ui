import fs from 'node:fs'
import path from 'node:path'
import { doc, sortMap } from '../../../shared/utils'
import type { ImportMaps, Route } from './api-routes.types'

// 🦆 Emit the generated API routes type map.
export function emitApiRoutesFile(outFile: string, routes: Route[], imports: ImportMaps) {
  const out: string[] = ['// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.', '']

  for (const [p, names] of sortMap(imports.typeImports)) {
    out.push(`import type { ${Array.from(names).sort().join(', ')} } from '${p}'`)
  }
  out.push('')

  out.push(...doc(['Internal route metadata shape used by ApiRoutes.']))
  out.push(
    'type RouteMeta<Body, Query, Params, Headers, Res, Method extends string> = ' +
      '{ body: Body; query: Query; params: Params; headers: Headers; res: Res; method: Method }',
  )
  out.push('')

  out.push(...doc(['Route map: path -> route metadata.', "Example: ApiRoutes['/api/auth/signin']"]))
  out.push('export interface ApiRoutes {')
  for (const r of routes.sort((a, b) => a.fullPath.localeCompare(b.fullPath))) {
    out.push(
      `  '${r.fullPath}': RouteMeta<${r.bodyType}, ${r.queryType}, ${r.paramsType}, ${r.headersType}, ${r.resType}, '${r.httpMethod}'>`,
    )
  }
  out.push('}', '')

  out.push(...doc(['Lookup helper for a single route entry.', "Example: RouteOf<'/api/auth/signin'>"]))
  out.push('type RouteOf<P extends keyof ApiRoutes> = ApiRoutes[P]')
  out.push(...doc(['Removes keys with `never` values for cleaner request shapes.']))
  out.push('type CleanupNever<T> = {')
  out.push('  [K in keyof T as T[K] extends never ? never : K]: T[K]')
  out.push('}')
  out.push('')

  out.push(...doc(['Union of all route paths.']))
  out.push('export type RoutePath = keyof ApiRoutes')
  out.push(...doc(['HTTP method for a given path.', "Example: RouteMethod<'/api/auth/signin'>"]))
  out.push("export type RouteMethod<P extends RoutePath> = RouteOf<P>['method']")
  out.push(...doc(['Response type for a given path.']))
  out.push("export type RouteRes<P extends RoutePath> = RouteOf<P>['res']")
  out.push(
    ...doc(['Request shape for a given path (body/query/params/headers).', "Example: RouteReq<'/api/auth/signin'>"]),
  )
  out.push(
    "export type RouteReq<P extends RoutePath> = CleanupNever<Pick<RouteOf<P>, 'body' | 'query' | 'params' | 'headers'>>",
  )
  out.push(...doc(['Union of all HTTP methods used by routes.']))
  out.push("export type RouteMethods = ApiRoutes[RoutePath]['method']")
  out.push(...doc(['Filters route paths by method.', "Example: PathsByMethod<'GET'>"]))
  out.push(
    'export type PathsByMethod<M extends RouteMethods> = { [P in RoutePath]: RouteMethod<P> extends M ? P : never }[RoutePath]',
  )
  out.push(...doc(['Fetcher signature for a typed client.']))
  out.push('export type DuckFetcher = <P extends RoutePath>(path: P, req: RouteReq<P>) => Promise<RouteRes<P>>')
  out.push(...doc(['Typed client helper with request/byMethod.']))
  out.push(
    'export type DuckClient = { request: DuckFetcher; byMethod: <M extends RouteMethods, P extends PathsByMethod<M>>(method: M, path: P, req: RouteReq<P>) => Promise<RouteRes<P>> }',
  )
  out.push('')

  out.push(...doc(['Body type for a path.']))
  out.push("export type GetBody<P extends keyof ApiRoutes> = RouteOf<P>['body']")
  out.push(...doc(['Query type for a path.']))
  out.push("export type GetQuery<P extends keyof ApiRoutes> = RouteOf<P>['query']")
  out.push(...doc(['Params type for a path.']))
  out.push("export type GetParams<P extends keyof ApiRoutes> = RouteOf<P>['params']")
  out.push(...doc(['Headers type for a path.']))
  out.push("export type GetHeaders<P extends keyof ApiRoutes> = RouteOf<P>['headers']")
  out.push(...doc(['Response type for a path.']))
  out.push("export type GetRes<P extends keyof ApiRoutes> = RouteOf<P>['res']")
  out.push(...doc(['Request type for a path (alias of RouteReq).']))
  out.push('export type GetReq<P extends keyof ApiRoutes> = RouteReq<P>')

  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, out.join('\n'), 'utf8')
}
