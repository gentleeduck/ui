import { ENV } from '../globals/env'
import * as DB_SCHEMA from './schema'
import * as RELATIONS from './relations'
import { drizzle } from 'drizzle-orm/node-postgres'

// DEFINE SCHEMA.
export const schema = {
  ...DB_SCHEMA,
  ...RELATIONS,
}
// INSTANTIATE DRIZZLE CLIENT WITH PG DRIVER AND SCHEMA.
export const db = drizzle(ENV.CONNECTIONSTRING, { schema })
