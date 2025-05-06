import { z } from 'zod'
import { BASE_COLORS, PROJECT_TYPE } from './preflight-duckui.constants'

export const preflight_duckui_options_schema = z.object({
  duckui: z
    .boolean({
      message: 'You have to pick one option',
      description: 'Would you like to use duck-ui? (yes/no) -default: no',
    })
    .default(false),
})

export const duckui_prompts_schema = z.object({
  project_type: z.enum(PROJECT_TYPE, {
    message: 'Invalid value for projectType.',
    description: 'Please select a valid project type.',
  }),
  base_color: z.enum(['zinc', 'slate', 'gray', 'neutral', 'red', 'rose', 'orange', 'green', 'blue'], {
    description: 'The primary color theme for your project.',
    errorMap: () => ({ message: 'Please select a valid base color.' }),
  }),
  alias: z
    .string({
      description: 'Defines the alias used for importing modules.',
    })
    .min(1, {
      message: 'Import alias cannot be empty.',
    })
    .default('~'),

  monorepo: z.boolean({
    description: 'Indicates if your project is inside a monorepo.',
    errorMap: () => ({ message: 'Invalid value for monorepo.' }),
  }),

  css: z
    .string({
      description: 'Specifies the location of your global CSS file.',
    })
    .min(1, {
      message: 'CSS file path cannot be empty.',
    }),

  css_variables: z.boolean({
    description: 'Determines whether CSS variables will be used.',
    errorMap: () => ({ message: 'Invalid value for cssVariables.' }),
  }),

  prefix: z.string().optional().default('').describe('A custom prefix for component class names or variables.'),
})

export type DuckuiPrompts = z.infer<typeof duckui_prompts_schema>

export const duck_ui_schema = z.object({
  schema: z.string().url(),
  rsc: z.boolean(),
  monorepo: z.boolean(),
  tailwind: z.object({
    baseColor: z.enum(BASE_COLORS),
    css: z.string(),
    cssVariables: z.boolean(),
    prefix: z.string(),
  }),
  aliases: z.object({
    ui: z.string(),
    libs: z.string(),
    hooks: z.string(),
    pages: z.string(),
    layouts: z.string(),
  }),
})
export type DuckUI = z.infer<typeof duck_ui_schema>
