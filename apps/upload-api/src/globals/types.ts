import { PgTable } from 'drizzle-orm/pg-core/table'

export type GetSchemaType<TColumns extends PgTable> = {
  [Key in keyof TColumns['_']['columns']]: TColumns['_']['columns'][Key]['_']['notNull'] extends true
    ? TColumns['_']['columns'][Key]['_']['data']
    : TColumns['_']['columns'][Key]['_']['data'] | null
  // deno-lint-ignore ban-types
} & {}
