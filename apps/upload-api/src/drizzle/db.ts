import { drizzle } from 'drizzle-orm/node-postgres'
import { ENV } from '../globals/env'
import * as RELATIONS from './relations'
import * as DB_SCHEMA from './schema'

// DEFINE SCHEMA.
export const schema = {
  ...DB_SCHEMA,
  ...RELATIONS,
}
// INSTANTIATE DRIZZLE CLIENT WITH PG DRIVER AND SCHEMA.
export const db = drizzle(ENV.CONNECTIONSTRING, { schema })
