// index.ctx.ts
import { ApiRoutes } from '.'
import { signin_controller } from './index-server'

// Route registry
export const routerRegistry = {
  get: {} as Record<string, Function>,
  post: {} as Record<string, Function>,
  use: {} as Record<string, Function>,
}

// Helper to create a route and register it
export function createRoute<T extends string, U extends Function>(route: T, cb: U) {
  routerRegistry.get[route] = cb // store in registry
  return [route, cb] as const
}

// Register your route
createRoute('/api/auth/signin', signin_controller)
createRoute('/api/auth/signup', signin_controller)

export type GetRes<T extends keyof ApiRoutes> = ApiRoutes[T]['res']
