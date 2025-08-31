import { PgTable } from 'drizzle-orm/pg-core/table'
import { files, folders } from '../drizzle'

export type GetSchemaType<TColumns extends PgTable> = {
  [Key in keyof TColumns['_']['columns']]: TColumns['_']['columns'][Key]['_']['notNull'] extends true
    ? TColumns['_']['columns'][Key]['_']['data']
    : TColumns['_']['columns'][Key]['_']['data'] | null
}

export type BucketFilesType = GetSchemaType<typeof files>
export type BucketFilesTypee = typeof files.$inferSelect
export type BucketFoldersType = GetSchemaType<typeof folders>

export type TRPC_RESPONSE<T extends any> =
  | {
      data: null
      message: string
      _?: any
    }
  | {
      data: T
      message: string
      _?: string
    }

export type PPData<T> = {
  [K in keyof T]: T[K]
} & {}

export type PData<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : T[K] extends string | null ? string | null : string
} & {}
