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

/**
 * Alias prefix charset matches what tsconfig path keys typically allow: letters, digits, `_`,
 * `-`, `@`, `$`, and `~`. Excludes `/`, `\`, `..`, and shell metacharacters so the alias never
 * widens the on-disk write target beyond a simple namespace identifier.
 */
const ALIAS_PREFIX_PATTERN = /^[A-Za-z0-9_@$~-]+$/
/**
 * `aliases.ui` is the on-disk subdir inside the workspace. Enforces alias-prefix segment
 * plus `/`-separated identifier segments to keep the path from escaping into siblings
 * (e.g. `../`) or absolute roots (e.g. `/etc`).
 */
const ALIAS_UI_PATTERN = /^[A-Za-z0-9_@$~-]+(?:\/[A-Za-z0-9_-]+)+$/
/** CSS file paths must be relative and free of `..` segments. */
const SAFE_RELATIVE_FILE_PATTERN = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$)).+/

/** A custom prefix flowing into Tailwind class names; safe Tailwind variant charset. */
const SAFE_CSS_PREFIX_PATTERN = /^[A-Za-z0-9_-]*$/

export const duckuiPromptsSchema = z.object({
  alias: z
    .string()
    .min(1, {
      error: 'Import alias cannot be empty.',
    })
    .regex(ALIAS_PREFIX_PATTERN, {
      message: 'Alias may only contain letters, numbers, "-", "_", "@", or "$".',
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
    .regex(SAFE_RELATIVE_FILE_PATTERN, {
      message: 'CSS path must be relative and may not contain ".." traversal.',
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

  prefix: z
    .string()
    .regex(SAFE_CSS_PREFIX_PATTERN, {
      message: 'Prefix may only contain letters, numbers, "-", or "_".',
    })
    .optional()
    .default('')
    .describe('A custom prefix for component class names or variables.'),
  projectType: z
    .enum(PROJECT_TYPE, {
      error: 'Invalid value for projectType.',
    })
    .describe('Please select a valid project type.'),
})

/**
 * Schema for `aliases.ui`. The alias-prefix-plus-identifier shape blocks `..` traversal
 * and absolute paths even when the alias is hand-edited in `duck-ui.config.json`.
 */
const aliasUiSchema = z.string().regex(ALIAS_UI_PATTERN, {
  message: 'aliases.ui must look like "<alias>/<segment>[/<segment>...]" with safe identifier characters only.',
})

export const duckUiSchema = z.object({
  aliases: z.object({
    hooks: z.string(),
    layouts: z.string(),
    libs: z.string(),
    pages: z.string(),
    ui: aliasUiSchema,
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
    css: z.string().regex(SAFE_RELATIVE_FILE_PATTERN, {
      message: 'tailwind.css must be relative and may not contain ".." traversal.',
    }),
    // Optional path (relative to this config file's directory) pointing at a
    // separate workspace that owns the CSS file. When absent, the CSS lives in
    // the same workspace as the config and `css` is interpreted relative to it.
    cssWorkspace: z.string().optional(),
    cssVariables: z.boolean(),
    prefix: z.string().regex(SAFE_CSS_PREFIX_PATTERN, {
      message: 'tailwind.prefix may only contain letters, numbers, "-", or "_".',
    }),
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
