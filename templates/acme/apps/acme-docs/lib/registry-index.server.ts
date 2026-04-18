import fs from 'node:fs'
import path from 'node:path'
import { registryEntrySchema } from '@gentleduck/registers'
import { cache } from 'react'
import { z } from 'zod'

const registryEntriesSchema = z.array(registryEntrySchema)

export const getRegistryIndex = cache(() => {
  const filePath = path.join(process.cwd(), 'public/r/index.json')
  const raw = fs.readFileSync(filePath, 'utf8')
  const parsed = registryEntriesSchema.parse(JSON.parse(raw))

  return Object.fromEntries(parsed.map((entry) => [entry.name, entry]))
})
