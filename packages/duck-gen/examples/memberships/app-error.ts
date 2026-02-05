import type { ApiRoutes, RouteReqMethod, RouteResMethod } from 'types'

/**
 * AppError
 *
 * Custom error class used to normalize error handling across the application.
 * It allows defining a name, a specific error code, and an HTTP status.
 *
 * @example
 * ```ts
 * throw new AppError('ValidationError', 'INVALID_INPUT', 400)
 * ```
 */
export class AppError extends Error {
  status: number

  constructor(name: string, code: string, status: number) {
    super(code)
    this.name = name
    this.status = status
    this.message = code
  }
}

export type MembershipsAdminModule = {
  list: (
    req: RouteReqMethod<'/v1/admin/memberships/:id', 'GET'>,
  ) => Promise<RouteResMethod<'/v1/admin/memberships/:id', 'GET'>>
}

import { createDuckQueryClient, type DuckQueryClient } from '@gentleduck/query'
export type DuckClient = DuckQueryClient<ApiRoutes>

export function createMembershipsAdminModule(client: DuckClient): MembershipsAdminModule {
  return {
    list: async (req) => {
      const { data } = await client.get('/v1/admin/memberships/:id', req)
      return data
    },
  }
}
