import { z } from 'zod'
import { BASE_COLORS, PROJECT_TYPE } from './preflight-duckui.constants'

export const preflightDuckuiOptionsSchema = z.object({
  duckui: z
    .boolean({
      error: 'You have to pick one option',
    })
    .default(false)
    .describe('Would you like to use @gentleduck/ui? (yes/no) -default: no'),
})

export const duckuiPromptsSchema = z.object({
  alias: z
    .string()
    .min(1, {
      error: 'Import alias cannot be empty.',
    })
    .default('~')
    .describe('Defines the alias used for importing modules.'),
  baseColor: z
    .enum(BASE_COLORS, {
      error: 'Please select a valid base color.',
    })
    .describe('The primary color theme for your project.'),

  css: z
    .string()
    .min(1, {
      message: 'CSS file path cannot be empty.',
    })
    .describe('Specifies the location of your global CSS file.'),

  cssVariables: z
    .boolean({
      error: 'Invalid value for cssVariables.',
    })
    .describe('Determines whether CSS variables will be used.'),

  monorepo: z
    .boolean({
      error: 'Invalid value for monorepo.',
    })
    .describe('Indicates if your project is inside a monorepo.'),

  prefix: z.string().optional().default('').describe('A custom prefix for component class names or variables.'),
  projectType: z
    .enum(PROJECT_TYPE, {
      error: 'Invalid value for projectType.',
    })
    .describe('Please select a valid project type.'),
})

export const duckUiSchema = z.object({
  aliases: z.object({
    hooks: z.string(),
    layouts: z.string(),
    libs: z.string(),
    pages: z.string(),
    ui: z.string(),
  }),
  monorepo: z.boolean(),
  workspace: z.object({
    root: z.string(),
    project: z.string(),
  }),
  rsc: z.boolean(),
  schema: z.url(),
  tailwind: z.object({
    baseColor: z.enum(BASE_COLORS),
    css: z.string(),
    // Optional path (relative to this config file's directory) pointing at a
    // separate workspace that owns the CSS file. When absent, the CSS lives in
    // the same workspace as the config and `css` is interpreted relative to it.
    cssWorkspace: z.string().optional(),
    cssVariables: z.boolean(),
    prefix: z.string(),
  }),
})
export interface DuckUI extends z.infer<typeof duckUiSchema> {}

export namespace DuckUI {
  export interface Prompts extends z.infer<typeof duckuiPromptsSchema> {}

  export interface Resolution {
    workspaceCwd: string
    monorepo: boolean
    cssWorkspaceCwd: string
  }
}
