import { defineConfig } from 'drizzle-kit'
import { ENV } from './src/globals'

export default defineConfig({
  out: './drizzle',
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  verbose: true,
  strict: false,
  dbCredentials: {
    url: ENV.CONNECTIONSTRING,
  },
  schemaFilter: ['public'],
})
