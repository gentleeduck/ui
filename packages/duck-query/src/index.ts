import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

export type DuckRouteMeta = {
  body: unknown
  query: unknown
  params: unknown
  headers: unknown
  res: unknown
  method: string
}

export type DuckApiRoutes = Record<string, DuckRouteMeta>

type CleanupNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

export type RoutePath<Routes> = keyof Routes & string
export type RouteOf<Routes, P extends RoutePath<Routes>> = Routes[P] extends DuckRouteMeta ? Routes[P] : never
export type RouteMethod<Routes, P extends RoutePath<Routes>> = RouteOf<Routes, P>['method']
export type RouteRes<Routes, P extends RoutePath<Routes>> = RouteOf<Routes, P>['res']
export type RouteReq<Routes, P extends RoutePath<Routes>> = CleanupNever<
  Pick<RouteOf<Routes, P>, 'body' | 'query' | 'params' | 'headers'>
>
export type RouteMethods<Routes> = RouteOf<Routes, RoutePath<Routes>>['method']
export type RouteOfMethod<Routes, P extends RoutePath<Routes>, M extends string> = Extract<
  RouteOf<Routes, P>,
  { method: M }
>
export type RouteResMethod<Routes, P extends RoutePath<Routes>, M extends string> = RouteOfMethod<Routes, P, M>['res']
export type RouteReqMethod<Routes, P extends RoutePath<Routes>, M extends string> = CleanupNever<
  Pick<RouteOfMethod<Routes, P, M>, 'body' | 'query' | 'params' | 'headers'>
>
export type PathsByMethod<Routes, M extends string> = {
  [P in RoutePath<Routes>]: M extends RouteMethod<Routes, P> ? P : never
}[RoutePath<Routes>]

export type DuckQueryClient<Routes> = {
  axios: AxiosInstance
  request: <P extends RoutePath<Routes>>(
    path: P,
    req?: RouteReq<Routes, P>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteRes<Routes, P>>>
  byMethod: <M extends RouteMethods<Routes>, P extends PathsByMethod<Routes, M>>(
    method: M,
    path: P,
    req?: RouteReqMethod<Routes, P, M>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteResMethod<Routes, P, M>>>
  get: <P extends PathsByMethod<Routes, 'GET'>>(
    path: P,
    req?: RouteReqMethod<Routes, P, 'GET'>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteResMethod<Routes, P, 'GET'>>>
  del: <P extends PathsByMethod<Routes, 'DELETE'>>(
    path: P,
    req?: RouteReqMethod<Routes, P, 'DELETE'>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteResMethod<Routes, P, 'DELETE'>>>
  post: <P extends PathsByMethod<Routes, 'POST'>>(
    path: P,
    req: RouteReqMethod<Routes, P, 'POST'>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteResMethod<Routes, P, 'POST'>>>
  put: <P extends PathsByMethod<Routes, 'PUT'>>(
    path: P,
    req: RouteReqMethod<Routes, P, 'PUT'>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteResMethod<Routes, P, 'PUT'>>>
  patch: <P extends PathsByMethod<Routes, 'PATCH'>>(
    path: P,
    req: RouteReqMethod<Routes, P, 'PATCH'>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteResMethod<Routes, P, 'PATCH'>>>
}

/**
 * Erased request shape used inside the implementation. The public API enforces
 * the per-route shape via generics; once we reach the dispatcher we only need
 * to know that these properties may exist.
 */
type AnyReq = {
  body?: unknown
  params?: Record<string, unknown>
  query?: unknown
  headers?: unknown
}

const BODY_LESS_METHODS = new Set(['GET', 'DELETE', 'HEAD', 'OPTIONS'])

const REGEX_META_CHARS = /[.*+?^${}()|[\]\\]/g
const UNRESOLVED_TOKEN = /\/:[A-Za-z_][A-Za-z0-9_]*/

function escapeRegex(value: string): string {
  return value.replace(REGEX_META_CHARS, '\\$&')
}

function buildUrl(url: string, params?: Record<string, unknown>): string {
  let out = url
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v == null) {
        throw new Error(
          `[@gentleduck/query] Path param "${k}" is ${v === null ? 'null' : 'undefined'} for "${url}". ` +
            `Provide a defined value via req.params.`,
        )
      }
      out = out.replace(new RegExp(`:${escapeRegex(k)}\\b`, 'g'), encodeURIComponent(String(v)))
    }
  }
  const leftover = out.match(UNRESOLVED_TOKEN)
  if (leftover) {
    throw new Error(
      `[@gentleduck/query] Unresolved path token "${leftover[0].slice(1)}" in "${url}". ` +
        `Provide it via req.params.`,
    )
  }
  return out
}

function pickHeaders(req: AnyReq | undefined, config?: AxiosRequestConfig) {
  return req?.headers ?? config?.headers
}

function pickQuery(req: AnyReq | undefined, config?: AxiosRequestConfig) {
  return req?.query ?? config?.params
}

function isAxiosInstance(value: AxiosInstance | AxiosRequestConfig | undefined): value is AxiosInstance {
  return !!value && typeof (value as AxiosInstance).request === 'function'
}

function resolveAxiosInstance(options?: AxiosInstance | AxiosRequestConfig): AxiosInstance {
  if (isAxiosInstance(options)) return options
  return axios.create(options)
}

function methodAllowsBody(method: string): boolean {
  return !BODY_LESS_METHODS.has(method)
}

export function createDuckQueryClient<Routes>(options?: AxiosInstance | AxiosRequestConfig): DuckQueryClient<Routes> {
  const instance = resolveAxiosInstance(options)

  function dispatch<T>(
    method: string,
    path: string,
    req: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    // Single boundary cast: public generics enforce the per-route shape; from
    // here on we only need to know that these optional properties may exist.
    const r = req as AnyReq | undefined
    const normalized = method.toUpperCase()
    const merged: AxiosRequestConfig = {
      ...(config ?? {}),
      method: normalized,
      url: buildUrl(path, r?.params),
      params: pickQuery(r, config),
      headers: pickHeaders(r, config),
    }

    if (methodAllowsBody(normalized)) {
      merged.data = r?.body
    }

    return instance.request<T>(merged)
  }

  const byMethod: DuckQueryClient<Routes>['byMethod'] = (method, path, req, config) =>
    dispatch(method, path, req, config)

  const request: DuckQueryClient<Routes>['request'] = (path, req, config) =>
    dispatch(config?.method ?? 'GET', path, req, config)

  const get: DuckQueryClient<Routes>['get'] = (path, req, config) => dispatch('GET', path, req, config)

  const del: DuckQueryClient<Routes>['del'] = (path, req, config) => dispatch('DELETE', path, req, config)

  const post: DuckQueryClient<Routes>['post'] = (path, req, config) => dispatch('POST', path, req, config)

  const put: DuckQueryClient<Routes>['put'] = (path, req, config) => dispatch('PUT', path, req, config)

  const patch: DuckQueryClient<Routes>['patch'] = (path, req, config) => dispatch('PATCH', path, req, config)

  return {
    axios: instance,
    request,
    byMethod,
    get,
    del,
    post,
    put,
    patch,
  }
}
