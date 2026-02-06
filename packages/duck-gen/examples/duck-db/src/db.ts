import 'dotenv/config'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as full_db from './schema'

const schema = {
  ...full_db,
}

const client = new Pool({
  connectionString: process.env.DATABASE_URL as string,
})

export const db = drizzle(client, { casing: 'snake_case', schema })

export { schema }
export type DrizzleSchema = typeof schema
