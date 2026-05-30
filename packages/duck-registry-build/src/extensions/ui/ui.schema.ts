import { z } from 'zod'
import { SAFE_NAME_REGEX, SAFE_RELATIVE_PATH_REGEX } from '../../lib/safe-path'
import type { IRegistryBuildThemeEntry } from './ui.config.types'
import type { IRegistryEntry, RegistryItemType } from './ui.registry.types'

const nonEmptyStringSchema = z.string().trim().min(1)

// Names flow into output filenames (`<name>.json`) and into generated TSX object keys.
// Restrict to a path-component-safe charset so they can never escape the output dir
// or break out of a quoted string in generated code.
const safeNameSchema = nonEmptyStringSchema.regex(
  SAFE_NAME_REGEX,
  'must only contain letters, digits, dot, underscore, and hyphen',
)

// Relative paths are joined against trusted source/output dirs. Reject `..`, absolute
// paths, and any character outside the relative-path allowlist so a hostile config
// cannot read or write outside its configured root.
const safeRelativePathSchema = nonEmptyStringSchema
  .regex(SAFE_RELATIVE_PATH_REGEX, 'must only contain letters, digits, dot, underscore, hyphen, and forward slash')
  .refine((value) => !value.split(/[\\/]+/).some((segment) => segment === '..'), {
    message: 'must not contain ".." traversal segments',
  })
  .refine((value) => !/^([a-zA-Z]:)?[\\/]/.test(value), {
    message: 'must be relative (absolute paths are not allowed)',
  })

export const registryItemTypeSchema = nonEmptyStringSchema.regex(/^registry:.+$/) as z.ZodType<RegistryItemType>

export const registryItemFileSchema = z.object({
  content: z.string().optional(),
  path: safeRelativePathSchema,
  target: safeRelativePathSchema.optional(),
  type: registryItemTypeSchema,
})

export const registryItemTailwindSchema = z.object({
  config: z.object({
    content: z.array(nonEmptyStringSchema).optional(),
    plugins: z.array(nonEmptyStringSchema).optional(),
    theme: z.record(z.string(), z.unknown()).optional(),
  }),
})

export const registryItemCssVarsSchema = z.object({
  dark: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
})

export const registryEntrySchema: z.ZodType<IRegistryEntry> = z
  .object({
    categories: z.array(nonEmptyStringSchema).optional(),
    cssVars: registryItemCssVarsSchema.optional(),
    dependencies: z.array(nonEmptyStringSchema).optional(),
    description: z.string().optional(),
    devDependencies: z.array(nonEmptyStringSchema).optional(),
    files: z.array(registryItemFileSchema).optional(),
    name: safeNameSchema,
    registryDependencies: z.array(nonEmptyStringSchema).optional(),
    root_folder: safeRelativePathSchema,
    source: z.string().optional(),
    tailwind: registryItemTailwindSchema.optional(),
    type: registryItemTypeSchema,
  })
  .catchall(z.unknown())

export const registryEntryListSchema = z.array(registryEntrySchema)

export const themeEntrySchema: z.ZodType<IRegistryBuildThemeEntry> = z.object({
  dark: z.record(z.string(), z.string()),
  label: nonEmptyStringSchema,
  light: z.record(z.string(), z.string()),
  radius: nonEmptyStringSchema,
})

// Theme keys become CSS selectors (`.theme-<name>`) and filenames (`<name>.json`).
// Restrict them to the same name charset so a hostile config can't inject CSS rules
// or write outside the themes dir.
export const themeEntriesSchema = z.record(safeNameSchema, themeEntrySchema)
