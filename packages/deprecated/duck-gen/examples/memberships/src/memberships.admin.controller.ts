import { Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import type { MembershipsAdminService } from './memberships.admin.service'
import {
  type MembershipsAdminGetDto,
  MembershipsAdminGetSchema,
  type MembershipsMessageType,
} from './memberships.types'

@Controller('admin/memberships')
export class MembershipsAdminController {
  constructor(private readonly membershipsAdminService: MembershipsAdminService) {}

  @Get(':id')
  async get(
    @Param('id') membershipId: string,
    @Query(new ZodValidationPipe(MembershipsAdminGetSchema)) query: MembershipsAdminGetDto,
  ): Promise<ResponseType<typeof this.membershipsAdminService.get, MembershipsMessageType>> {
    const data = await this.membershipsAdminService.get({
      membershipId,
      ...query,
    })
    return { data, ok: true, code: 'MEMBERSHIPS_GET_SUCCESS' }
  }
}
export type ResponseType<
  TData extends (...args: any) => any,
  TMessage extends string = any,
  TExclude extends keyof Awaited<ReturnType<TData>> = never,
> =
  | {
      ok: false
      error: {
        code: TMessage
        cause?: unknown
        issues?: ReadonlyArray<string>
      }
    }
  | {
      ok: true
      data: Awaited<ReturnType<TData>> extends object
        ? [TExclude] extends [keyof Awaited<ReturnType<TData>>]
          ? Omit<Awaited<ReturnType<TData>>, TExclude>
          : Awaited<ReturnType<TData>>
        : Awaited<ReturnType<TData>>
      code: TMessage
    }

export type GParams<TDTO, TExeclude extends keyof TDTO = never, TAdmin extends boolean = false> = TAdmin extends true
  ? TDTO
  : Omit<TDTO, TExeclude>

export type MutateAsync<T> = Promise<{
  -readonly [P in keyof T]: T[P]
}>

export type Mutate<T> = {
  -readonly [P in keyof T]: T[P]
}
