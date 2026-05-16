import { schema } from '@gentleduck/db'
import { AppError } from './app-error'

/**
 * @duckgen messages
 */
export const MembershipsMessages = {
  MEMBERSHIPS_GET_SUCCESS: 200,
  MEMBERSHIP_NOT_FOUND: 404,
  MEMBERSHIPS_GET_FAILED: 500,
} as const satisfies Record<string, number>

export function throwError<T extends keyof typeof MembershipsMessages>(message: T): never {
  throw new AppError('MEMBERSHIPS_SERVICE', message, MembershipsMessages[message])
}

export const safeMembershipAdminSelect = {
  id: schema.memberships.id,
  tenantId: schema.memberships.tenantId,
  userId: schema.memberships.userId,
  status: schema.memberships.status,
  createdAt: schema.memberships.createdAt,
  updatedAt: schema.memberships.updatedAt,
  deletedAt: schema.memberships.deletedAt,
} as const

export const safeMembershipClientSelect = {
  id: schema.memberships.id,
  tenantId: schema.memberships.tenantId,
  userId: schema.memberships.userId,
  status: schema.memberships.status,
} as const
