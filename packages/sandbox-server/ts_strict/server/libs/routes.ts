export function createRoute<T extends string, U extends (...args: any) => unknown>(route: T, cb: U) {
  routerRegistry[route] = cb
  return [route, cb] as const
}

export const routerRegistry: Record<string, Function> = {}

// Enhanced route registry with metadata
export interface RouteMetadata {
  route: string
  method: string
  handler: string
  file: string
  middleware?: string[]
}

export const routeMetadata: RouteMetadata[] = []

export function registerRoute(metadata: Omit<RouteMetadata, 'file'>) {
  const fullMetadata: RouteMetadata = {
    ...metadata,
    file: new Error().stack?.split('\n')[2]?.match(/\(([^)]+)\)/)?.[1] || 'unknown',
  }
  routeMetadata.push(fullMetadata)
  return fullMetadata
}
