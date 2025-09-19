import { defineConfig } from 'drizzle-kit'
import { ENV } from './src/globals'

export default defineConfig({
  dbCredentials: {
    url: ENV.CONNECTIONSTRING,
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/drizzle/schema.ts',
  schemaFilter: ['public'],
  strict: false,
  verbose: true,
})
