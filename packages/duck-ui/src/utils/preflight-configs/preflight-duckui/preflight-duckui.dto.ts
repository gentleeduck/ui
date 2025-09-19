import { z } from 'zod'
import { BASE_COLORS, PROJECT_TYPE } from './preflight-duckui.constants'

export const preflight_duckui_options_schema = z.object({
  duckui: z
    .boolean({
      description: 'Would you like to use duck-ui? (yes/no) -default: no',
      message: 'You have to pick one option',
    })
    .default(false),
})

export const duckui_prompts_schema = z.object({
  alias: z
    .string({
      description: 'Defines the alias used for importing modules.',
    })
    .min(1, {
      message: 'Import alias cannot be empty.',
    })
    .default('~'),
  base_color: z.enum(['zinc', 'slate', 'gray', 'neutral', 'red', 'rose', 'orange', 'green', 'blue'], {
    description: 'The primary color theme for your project.',
    errorMap: () => ({ message: 'Please select a valid base color.' }),
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

  monorepo: z.boolean({
    description: 'Indicates if your project is inside a monorepo.',
    errorMap: () => ({ message: 'Invalid value for monorepo.' }),
  }),

  prefix: z.string().optional().default('').describe('A custom prefix for component class names or variables.'),
  project_type: z.enum(PROJECT_TYPE, {
    description: 'Please select a valid project type.',
    message: 'Invalid value for projectType.',
  }),
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
  schema: z.string().url(),
  tailwind: z.object({
    baseColor: z.enum(BASE_COLORS),
    css: z.string(),
    cssVariables: z.boolean(),
    prefix: z.string(),
  }),
})
export type DuckUI = z.infer<typeof duck_ui_schema>
