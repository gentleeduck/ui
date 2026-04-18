import { z } from 'zod'
import { BASE_COLORS, PROJECT_TYPE } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.constants'

export const initOptionsSchema = z.object({
  alias: z.string().optional(),
  all: z.boolean().default(false),
  baseColor: z.enum(BASE_COLORS).optional(),
  css: z.string().optional(),
  cssVariables: z.boolean().optional(),
  cssWorkspace: z.string().optional(),
  cwd: z.string().default(process.cwd()),
  monorepo: z.boolean().optional(),
  workspace: z.string().optional(),
  prefix: z.string().optional(),
  projectType: z.enum(PROJECT_TYPE).optional(),
  template: z.string().optional(),
  yes: z.boolean().default(false),
})

export const initArgumentsSchema = z.array(z.string()).default([])

export type InitOptions = z.infer<typeof initOptionsSchema>
