import fs from 'node:fs'
import path from 'node:path'
import { doc, sortMap } from '../../../shared/utils'
import type { ImportMaps, Route } from './api-routes.types'

function pushDoc(out: string[], lines: string[]) {
  const d = doc(lines) as unknown
  if (Array.isArray(d)) out.push(...d)
  else out.push(String(d))
}

// 🦆 Emit the generated API routes type map.
export function emitApiRoutesFile(outFile: string, routes: Route[], imports: ImportMaps) {
  const out: string[] = ['// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.', '']

  for (const [p, names] of sortMap(imports.typeImports)) {
    out.push(`import type { ${Array.from(names).sort().join(', ')} } from '${p}'`)
  }
  out.push('')

  pushDoc(out, ['Internal route metadata shape used by ApiRoutes.'])
  out.push(
    'type RouteMeta<Body, Query, Params, Headers, Res, Method extends string> = ' +
      '{ body: Body; query: Query; params: Params; headers: Headers; res: Res; method: Method }',
  )
  out.push('')

  pushDoc(out, ['Route map: path -> route metadata.', "Example: ApiRoutes['/api/auth/signin']"])
  out.push('export interface ApiRoutes {')
  const routesByPath = new Map<string, Route[]>()
  for (const r of routes) {
    if (!routesByPath.has(r.fullPath)) {
      routesByPath.set(r.fullPath, [])
    }
    routesByPath.get(r.fullPath)!.push(r)
  }

  for (const path of Array.from(routesByPath.keys()).sort()) {
    const group = routesByPath.get(path)!
    group.sort((a, b) => a.httpMethod.localeCompare(b.httpMethod))

    const types = group.map(
      (r) =>
        `RouteMeta<${r.bodyType}, ${r.queryType}, ${r.paramsType}, ${r.headersType}, ${r.resType}, '${r.httpMethod}'>`,
    )
    out.push(`  '${path}': ${types.join(' | ')}`)
  }
  out.push('}', '')

  pushDoc(out, ['Lookup helper for a single route entry.', "Example: RouteOf<'/api/auth/signin'>"])
  out.push('type RouteOf<P extends keyof ApiRoutes> = ApiRoutes[P]')

  pushDoc(out, ['Removes keys with `never` values for cleaner request shapes.'])
  out.push('type CleanupNever<T> = {')
  out.push('  [K in keyof T as T[K] extends never ? never : K]: T[K]')
  out.push('}')
  out.push('')

  pushDoc(out, ['Union of all route paths.'])
  out.push('export type RoutePath = keyof ApiRoutes')

  pushDoc(out, ['HTTP method for a given path.', "Example: RouteMethod<'/api/auth/signin'>"])
  out.push("export type RouteMethod<P extends RoutePath> = RouteOf<P>['method']")

  pushDoc(out, ['Response type for a given path.'])
  out.push("export type RouteRes<P extends RoutePath> = RouteOf<P>['res']")

  pushDoc(out, ['Request shape for a given path (body/query/params/headers).', "Example: RouteReq<'/api/auth/signin'>"])
  out.push(
    "export type RouteReq<P extends RoutePath> = CleanupNever<Pick<RouteOf<P>, 'body' | 'query' | 'params' | 'headers'>>",
  )

  pushDoc(out, ['Union of all HTTP methods used by routes.'])
  out.push("export type RouteMethods = ApiRoutes[RoutePath]['method']")

  pushDoc(out, ['Lookup helper for a route entry by method.', "Example: RouteOfMethod<'/api/auth/signin', 'POST'>"])
  out.push('type RouteOfMethod<P extends keyof ApiRoutes, M extends RouteMethods> = Extract<RouteOf<P>, { method: M }>')

  pushDoc(out, ['Response type for a given path and method.'])
  out.push("export type RouteResMethod<P extends RoutePath, M extends RouteMethods> = RouteOfMethod<P, M>['res']")

  pushDoc(out, ['Request shape for a given path and method.', "Example: RouteReqMethod<'/api/auth/signin', 'POST'>"])
  out.push(
    "export type RouteReqMethod<P extends RoutePath, M extends RouteMethods> = CleanupNever<Pick<RouteOfMethod<P, M>, 'body' | 'query' | 'params' | 'headers'>>",
  )

  pushDoc(out, ['Filters route paths by method.', "Example: PathsByMethod<'GET'>"])
  out.push(
    'export type PathsByMethod<M extends RouteMethods> = { [P in RoutePath]: M extends RouteMethod<P> ? P : never }[RoutePath]',
  )

  pushDoc(out, ['Fetcher signature for a typed client.'])
  out.push('export type DuckFetcher = <P extends RoutePath>(path: P, req: RouteReq<P>) => Promise<RouteRes<P>>')

  pushDoc(out, ['Typed client helper with request/byMethod.'])
  out.push(
    'export type DuckClient = { request: DuckFetcher; byMethod: <M extends RouteMethods, P extends PathsByMethod<M>>(method: M, path: P, req: RouteReqMethod<P, M>) => Promise<RouteResMethod<P, M>> }',
  )
  out.push('')

  pushDoc(out, ['Body type for a path.'])
  out.push("export type GetBody<P extends keyof ApiRoutes> = RouteOf<P>['body']")

  pushDoc(out, ['Query type for a path.'])
  out.push("export type GetQuery<P extends keyof ApiRoutes> = RouteOf<P>['query']")

  pushDoc(out, ['Params type for a path.'])
  out.push("export type GetParams<P extends keyof ApiRoutes> = RouteOf<P>['params']")

  pushDoc(out, ['Headers type for a path.'])
  out.push("export type GetHeaders<P extends keyof ApiRoutes> = RouteOf<P>['headers']")

  pushDoc(out, ['Response type for a path.'])
  out.push("export type GetRes<P extends keyof ApiRoutes> = RouteOf<P>['res']")

  pushDoc(out, ['Request type for a path (alias of RouteReq).'])
  out.push('export type GetReq<P extends keyof ApiRoutes> = RouteReq<P>')

  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, out.join('\n'), 'utf8')
}
