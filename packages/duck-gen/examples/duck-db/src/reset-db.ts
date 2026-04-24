import 'dotenv/config'
import { Client } from 'pg'

async function resetDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('🗑  Dropping all tables...')

    // Drop all tables in the correct order (respecting foreign key constraints)
    await client.query('DROP SCHEMA public CASCADE;')
    await client.query('CREATE SCHEMA public;')
    await client.query('GRANT ALL ON SCHEMA public TO public;')

    console.log('✅ Database reset complete!')
  } catch (error) {
    console.error('❌ Database reset failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

resetDatabase()
