import type { schema } from '@gentleduck/db'
import { MEMBERSHIP_STATUS_VALUES } from '@gentleduck/db/schema'
import type { AnyColumn, GetColumnData } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { z } from 'zod/v4'

// If these are used here, keep them. Otherwise remove.
// import { MembershipsMessages, safeMembershipAdminSelect, safeMembershipClientSelect } from "./memberships.constants";

// -----------------------------
// Shared Zod primitives/helpers
// -----------------------------

export const string = z.string(zodErr('ZOD_EXPECTED_STRING'))
export const uuid = z.uuid(zodErr('ZOD_EXPECTED_UUID'))
export const number = z.number(zodErr('ZOD_EXPECTED_NUMBER'))
export const boolean = z.boolean(zodErr('ZOD_EXPECTED_BOOLEAN'))
export const email = z.email(zodErr('ZOD_EXPECTED_EMAIL'))
export const json = z.json(zodErr('ZOD_EXPECTED_JSON'))
export const date = z.date(zodErr('ZOD_EXPECTED_DATE'))

export const strictObj = <S extends z.ZodRawShape>(shape: S) => z.strictObject(shape, zodErr('ZOD_EXPECTED_OBJECT'))

export const coerceIntOpt = z.preprocess((v) => {
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : v
}, z.number(zodErr('ZOD_EXPECTED_NUMBER')).int())

export const coerceBoolOpt = z.preprocess(
  (v) => {
    if (v === undefined || v === null || v === '') return undefined
    if (v === true || v === 'true') return true
    if (v === false || v === 'false') return false
    return v
  },
  z.boolean(zodErr('ZOD_EXPECTED_BOOLEAN')),
)

export const paginationSchema = strictObj({
  page: coerceIntOpt.optional(),
  limit: coerceIntOpt.optional(),
  orderBy: string.optional(),
  direction: z.enum(['asc', 'desc']).optional(),
  query: string.optional(),
})

// -----------------------------
// Memberships schemas (Admin)
// -----------------------------

export const membershipStatus = z.enum(MEMBERSHIP_STATUS_VALUES, zodErr('ZOD_EXPECTED_ENUM'))

export const MembershipsAdminListSchema = paginationSchema.extend({
  tenantId: uuid.optional(),
  userId: uuid.optional(),
  status: membershipStatus.optional(),
})

export const MembershipsAdminGetSchema = strictObj({
  userId: uuid.optional(),
  tenantId: uuid.optional(),
})

export const MembershipsAdminDeleteSchema = MembershipsAdminGetSchema

export const MembershipsAdminCreateSchema = strictObj({
  tenantId: uuid,
  userId: uuid,
  status: membershipStatus.optional(),
})

export const MembershipsAdminUpdateSchema = strictObj({
  userId: uuid.optional(),
  tenantId: uuid.optional(),
  status: membershipStatus.optional(),
  deleted: boolean.optional(),
})

// -----------------------------
// Zod message keys + mapping
// -----------------------------

export const ZOD_MESSAGES = [
  'ZOD_EXPECTED_STRING',
  'ZOD_EXPECTED_NUMBER',
  'ZOD_EXPECTED_BOOLEAN',
  'ZOD_EXPECTED_DATE',
  'ZOD_EXPECTED_BIGINT',
  'ZOD_EXPECTED_OBJECT',
  'ZOD_EXPECTED_ARRAY',
  'ZOD_EXPECTED_ENUM',
  'ZOD_EXPECTED_FUNCTION',
  'ZOD_EXPECTED_INSTANCE',
  'ZOD_EXPECTED_JSON',
  'ZOD_EXPECTED_BUFFER',
  'ZOD_EXPECTED_UNDEFINED',
  'ZOD_EXPECTED_NULL',
  'ZOD_EXPECTED_NAN',
  'ZOD_EXPECTED_SYMBOL',
  'ZOD_EXPECTED_REGEX',
  'ZOD_EXPECTED_DATE_TIME',
  'ZOD_EXPECTED_UUID',
  'ZOD_EXPECTED_URL',
  'ZOD_EXPECTED_EMAIL',
  'ZOD_TOO_SHORT',
  'ZOD_TOO_LONG',
  'ZOD_TOO_FEW',
  'ZOD_TOO_MANY',
  'ZOD_INVALID_EMAIL',
  'ZOD_INVALID_URL',
  'ZOD_INVALID_UUID',
  'ZOD_INVALID_DATE',
  'ZOD_INVALID_STRING',
  'ZOD_INVALID_NUMBER',
  'ZOD_INVALID_ENUM_VALUE',
  'ZOD_INVALID_LITERAL',
  'ZOD_INVALID_ARGUMENTS',
  'ZOD_INVALID_RETURN_TYPE',
  'ZOD_INVALID',
  'ZOD_REQUIRED',
  'ZOD_FAILED_TO_PARSE',
  'ZOD_UNRECOGNIZED_KEYS',
  'ZOD_CUSTOM',
  'ZOD_COERCE_FAILED',
  'ZOD_COERCE_DATE_FAILED',
  'ZOD_REFINEMENT_FAILED',
  'ZOD_TRANSFORM_FAILED',
  'ZOD_INVALID_UNION',
  'ZOD_INVALID_INTERSECTION',
  'ZOD_INVALID_TYPE_AT_INDEX',
  'ZOD_INVALID_ELEMENT',
  'ZOD_INVALID_EFFECT',
] as const

/**
 * @duckgen messages
 */
export const ZodMessages = Object.fromEntries(ZOD_MESSAGES.map((key) => [key, 400])) as Record<
  (typeof ZOD_MESSAGES)[number],
  400
>

// -----------------------------
// DTOs + Types (if used here)
// -----------------------------
// These require your local utilities/types.
// Uncomment when this file actually has access to them.

import { createZodDto } from 'nestjs-zod'
import { zodErr } from 'zod'
import type {
  MembershipsMessages,
  safeMembershipAdminSelect,
  safeMembershipClientSelect,
} from './memberships.constants'

export class MembershipsAdminListDto extends createZodDto(MembershipsAdminListSchema) {}
export class MembershipsAdminCreateDto extends createZodDto(MembershipsAdminCreateSchema) {}
export class MembershipsAdminUpdateDto extends createZodDto(MembershipsAdminUpdateSchema) {}
export class MembershipsAdminGetDto extends createZodDto(MembershipsAdminGetSchema) {}
export class MembershipsAdminDeleteDto extends createZodDto(MembershipsAdminDeleteSchema) {}

export type ColumnsShape = Record<string, AnyColumn>
export type InferReturning<T extends ColumnsShape> = {
  [K in keyof T]: GetColumnData<T[K], 'query'>
}

export type MembershipAdmin = InferReturning<typeof safeMembershipAdminSelect>
export type MembershipClient = InferReturning<typeof safeMembershipClientSelect>

export type MembershipsMessageType = keyof typeof MembershipsMessages

export type MembershipsAdminGetResponse = {
  data: MembershipAdmin
  ok: true
  code: 'MEMBERSHIPS_GET_SUCCESS'
}

// -----------------------------
// DB types
// -----------------------------

export type Tx = Parameters<NodePgDatabase<typeof schema>['transaction']>[0] extends (tx: infer T) => any ? T : any

export type Scope = 'admin' | 'client'
