import * as schema from '@gentleduck/db/schema'
import { Injectable } from '@nestjs/common'
import { and, eq, isNull, type SQLWrapper } from 'drizzle-orm'
import { AppError } from './app-error'
import { safeMembershipAdminSelect, safeMembershipClientSelect, throwError } from './memberships.constants'
import type { MembershipAdmin, MembershipClient, MembershipsAdminGetDto, Tx } from './memberships.types'

type Scope = 'admin' | 'client'
@Injectable()
export class MembershipsAdminService {
  async get(
    data: MembershipsAdminGetDto & { membershipId?: string },
    scope: 'client',
    tx?: Tx,
  ): Promise<MembershipClient>
  async get(
    data: MembershipsAdminGetDto & { membershipId?: string },
    scope?: 'admin',
    tx?: Tx,
  ): Promise<MembershipAdmin>
  async get(data: MembershipsAdminGetDto & { membershipId?: string }, scope: Scope = 'admin', tx?: Tx) {
    try {
      const run = async (executor: Tx) => {
        const where: SQLWrapper[] = []
        if (data.membershipId) where.push(eq(schema.memberships.id, data.membershipId))
        if (data.tenantId) where.push(eq(schema.memberships.tenantId, data.tenantId))
        if (data.userId) where.push(eq(schema.memberships.userId, data.userId))

        if (!where.length) throw throwError('MEMBERSHIPS_GET_FAILED')

        const select = scope === 'client' ? safeMembershipClientSelect : safeMembershipAdminSelect
        const [row] = await executor
          .select(select)
          .from(schema.memberships)
          .where(and(...where, isNull(schema.memberships.deletedAt)))
          .limit(1)

        if (!row) throw throwError('MEMBERSHIP_NOT_FOUND')
        return row
      }

      return await run(tx)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw throwError('MEMBERSHIPS_GET_FAILED')
    }
  }
}
