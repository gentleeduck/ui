import { z } from 'zod'
import { BASE_COLORS, PROJECT_TYPE } from './preflight-duckui.constants'

export const preflight_duckui_options_schema = z.object({
  duckui: z
    .boolean({
      error: 'You have to pick one option',
    })
    .default(false)
    .describe('Would you like to use @gentleduck/ui? (yes/no) -default: no'),
})

export const duckui_prompts_schema = z.object({
  alias: z
    .string()
    .min(1, {
      error: 'Import alias cannot be empty.',
    })
    .default('~')
    .describe('Defines the alias used for importing modules.'),
  base_color: z
    .enum(['zinc', 'slate', 'gray', 'neutral', 'red', 'rose', 'orange', 'green', 'blue'], {
      error: 'Please select a valid base color.',
    })
    .describe('The primary color theme for your project.'),

  css: z
    .string()
    .min(1, {
      message: 'CSS file path cannot be empty.',
    })
    .describe('Specifies the location of your global CSS file.'),

  css_variables: z
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
  project_type: z
    .enum(PROJECT_TYPE, {
      error: 'Invalid value for projectType.',
    })
    .describe('Please select a valid project type.'),
})

export type DuckuiPrompts = z.infer<typeof duckui_prompts_schema>

export const duck_ui_schema = z.object({
  aliases: z.object({
    hooks: z.string(),
    layouts: z.string(),
    libs: z.string(),
    pages: z.string(),
    ui: z.string(),
  }),
  monorepo: z.boolean(),
  rsc: z.boolean(),
  schema: z.url(),
  tailwind: z.object({
    baseColor: z.enum(BASE_COLORS),
    css: z.string(),
    cssVariables: z.boolean(),
    prefix: z.string(),
  }),
})
export type DuckUI = z.infer<typeof duck_ui_schema>
