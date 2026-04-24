import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: 'postgresql',
  //dialect: 'mysql',
  out: './migrations',
  schema: './src/schema/index.ts',
  verbose: true,
})
