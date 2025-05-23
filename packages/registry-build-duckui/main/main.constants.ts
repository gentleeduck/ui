import { registry_item_type_schema } from '@gentleduck/registers'
import path from 'node:path'
import { z } from 'zod'
import { config } from 'dotenv'
import { envSchema } from './main.dto'

config()
export const ENV = await envSchema.parseAsync(process.env)
export const REGISTRY_PATH = path.join(process.cwd(), `../..${ENV.REGISTRY_OUTPUT_PATH}public/duck-ui/`)

export const PUBLIC_REGISTRY_PATH = path.join(REGISTRY_PATH, 'components')

export const REGISTRY_INDEX_WHITELIST: z.infer<typeof registry_item_type_schema>[] = [
  'registry:ui',
  'registry:lib',
  'registry:hook',
  'registry:theme',
  'registry:block',
  'registry:example',
]

export const tsx_index: string = `// @ts-nocheck
// This file is autogenerated by scripts/build-registry/main/main.ts
// Do not edit this file directly.
import * as React from "react"

export const Index: Record<string, any> = {`
