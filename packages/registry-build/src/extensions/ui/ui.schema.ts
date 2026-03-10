import { z } from 'zod'
import type { RegistryBuildThemeEntry } from './ui.config.types'
import type { RegistryEntry, RegistryItemType } from './ui.registry.types'

const nonEmptyStringSchema = z.string().trim().min(1)

export const registryItemTypeSchema = nonEmptyStringSchema.regex(/^registry:.+$/) as z.ZodType<RegistryItemType>

export const registryItemFileSchema = z.object({
  content: z.string().optional(),
  path: nonEmptyStringSchema,
  target: nonEmptyStringSchema.optional(),
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

export const registryEntrySchema: z.ZodType<RegistryEntry> = z
  .object({
    categories: z.array(nonEmptyStringSchema).optional(),
    cssVars: registryItemCssVarsSchema.optional(),
    dependencies: z.array(nonEmptyStringSchema).optional(),
    description: z.string().optional(),
    devDependencies: z.array(nonEmptyStringSchema).optional(),
    files: z.array(registryItemFileSchema).optional(),
    name: nonEmptyStringSchema,
    registryDependencies: z.array(nonEmptyStringSchema).optional(),
    root_folder: nonEmptyStringSchema,
    source: z.string().optional(),
    tailwind: registryItemTailwindSchema.optional(),
    type: registryItemTypeSchema,
  })
  .catchall(z.unknown())

export const registryEntryListSchema = z.array(registryEntrySchema)

export const themeEntrySchema: z.ZodType<RegistryBuildThemeEntry> = z.object({
  dark: z.record(z.string(), z.string()),
  label: nonEmptyStringSchema,
  light: z.record(z.string(), z.string()),
  radius: nonEmptyStringSchema,
})

export const themeEntriesSchema = z.record(z.string(), themeEntrySchema)
