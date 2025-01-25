import { PgTable } from 'drizzle-orm/pg-core/table'
import { files } from '../drizzle'

export type GetSchemaType<TColumns extends PgTable> = {
  [Key in keyof TColumns['_']['columns']]: TColumns['_']['columns'][Key]['_']['notNull'] extends true
    ? TColumns['_']['columns'][Key]['_']['data']
    : TColumns['_']['columns'][Key]['_']['data'] | null
  // deno-lint-ignore ban-types
} & {}

export type FilesMutationType = GetSchemaType<typeof files>
export type FoldersMutationType = GetSchemaType<typeof files>

export type TRPC_RESPONSE<T extends any> =
  | {
      data: null
      message: string
      _: any
    }
  | {
      data: T
      message: string
      _: null
    }

export type PPData<T> = {
  [K in keyof T]: T[K]
} & {}

export type PData<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : T[K] extends string | null ? string | null : string
} & {}
