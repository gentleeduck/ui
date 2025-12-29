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
export type PathsByMethod<Routes, M extends string> = {
  [P in RoutePath<Routes>]: RouteMethod<Routes, P> extends M ? P : never
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
    req?: RouteReq<Routes, P>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteRes<Routes, P>>>
  get: <P extends PathsByMethod<Routes, 'GET'>>(
    path: P,
    req?: RouteReq<Routes, P>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteRes<Routes, P>>>
  del: <P extends PathsByMethod<Routes, 'DELETE'>>(
    path: P,
    req?: RouteReq<Routes, P>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteRes<Routes, P>>>
  post: <P extends PathsByMethod<Routes, 'POST'>>(
    path: P,
    req: RouteReq<Routes, P>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteRes<Routes, P>>>
  put: <P extends PathsByMethod<Routes, 'PUT'>>(
    path: P,
    req: RouteReq<Routes, P>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteRes<Routes, P>>>
  patch: <P extends PathsByMethod<Routes, 'PATCH'>>(
    path: P,
    req: RouteReq<Routes, P>,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<RouteRes<Routes, P>>>
}

function buildUrl(url: string, params?: Record<string, unknown>): string {
  if (!params) return url
  let out = url
  for (const [k, v] of Object.entries(params)) {
    out = out.replace(new RegExp(`:${k}\\b`, 'g'), encodeURIComponent(String(v)))
  }
  return out
}

function pickHeaders(req: any, config?: AxiosRequestConfig) {
  return req?.headers ?? config?.headers
}

function pickQuery(req: any, config?: AxiosRequestConfig) {
  return req?.query ?? (config as any)?.params
}

function isAxiosInstance(value: AxiosInstance | AxiosRequestConfig | undefined): value is AxiosInstance {
  return !!value && typeof (value as AxiosInstance).request === 'function'
}

function resolveAxiosInstance(options?: AxiosInstance | AxiosRequestConfig): AxiosInstance {
  if (isAxiosInstance(options)) return options
  return axios.create(options)
}

function methodAllowsBody(method: string): boolean {
  return !['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(method)
}

export function createDuckQueryClient<Routes>(options?: AxiosInstance | AxiosRequestConfig): DuckQueryClient<Routes> {
  const instance = resolveAxiosInstance(options)

  const byMethod: DuckQueryClient<Routes>['byMethod'] = (method, path, req, config) => {
    const url = buildUrl(path as string, (req as any)?.params)
    const normalized = method.toString().toUpperCase()
    const merged: AxiosRequestConfig = {
      ...(config ?? {}),
      method: normalized,
      url,
      params: pickQuery(req, config),
      headers: pickHeaders(req, config),
    }

    if (methodAllowsBody(normalized)) {
      merged.data = (req as any)?.body
    }

    return instance.request(merged)
  }

  const request: DuckQueryClient<Routes>['request'] = (path, req, config) => {
    const method = (config?.method ?? 'GET').toString()
    return byMethod(method as RouteMethods<Routes>, path as any, req as any, config)
  }

  const get: DuckQueryClient<Routes>['get'] = (path, req, config) => {
    const url = buildUrl(path as string, (req as any)?.params)
    return instance.get(url, {
      ...(config ?? {}),
      params: pickQuery(req, config),
      headers: pickHeaders(req, config),
    })
  }

  const del: DuckQueryClient<Routes>['del'] = (path, req, config) => {
    const url = buildUrl(path as string, (req as any)?.params)
    return instance.delete(url, {
      ...(config ?? {}),
      params: pickQuery(req, config),
      headers: pickHeaders(req, config),
    })
  }

  const post: DuckQueryClient<Routes>['post'] = (path, req, config) => {
    const url = buildUrl(path as string, (req as any)?.params)
    return instance.post(url, (req as any)?.body, {
      ...(config ?? {}),
      params: pickQuery(req, config),
      headers: pickHeaders(req, config),
    })
  }

  const put: DuckQueryClient<Routes>['put'] = (path, req, config) => {
    const url = buildUrl(path as string, (req as any)?.params)
    return instance.put(url, (req as any)?.body, {
      ...(config ?? {}),
      params: pickQuery(req, config),
      headers: pickHeaders(req, config),
    })
  }

  const patch: DuckQueryClient<Routes>['patch'] = (path, req, config) => {
    const url = buildUrl(path as string, (req as any)?.params)
    return instance.patch(url, (req as any)?.body, {
      ...(config ?? {}),
      params: pickQuery(req, config),
      headers: pickHeaders(req, config),
    })
  }

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
