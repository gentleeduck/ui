import { z } from 'zod'
import type { RegistryBuildExtension } from '../extensions/types'
import type { RegistryEntry, RegistryItemType } from '../types'

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

export const registryEntriesSchema = z.record(z.string(), z.array(registryEntrySchema))

export const themeEntrySchema = z.object({
  dark: z.record(z.string(), z.string()),
  label: nonEmptyStringSchema,
  light: z.record(z.string(), z.string()),
  radius: nonEmptyStringSchema,
})

export const themeEntriesSchema = z.record(z.string(), themeEntrySchema)

export const registryBuildExtensionSchema = z.custom<RegistryBuildExtension>((value) => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string' &&
    'run' in value &&
    typeof (value as { run?: unknown }).run === 'function'
  )
})

export const registryBuildConfigSchema = z.object({
  extends: z.union([nonEmptyStringSchema, z.array(nonEmptyStringSchema)]).optional(),
  branding: z
    .object({
      font: nonEmptyStringSchema.optional(),
      name: nonEmptyStringSchema.optional(),
    })
    .optional(),
  colors: z
    .object({
      data: z.union([nonEmptyStringSchema, z.record(z.string(), z.unknown())]).optional(),
    })
    .optional(),
  componentIndex: z
    .object({
      excludeTypes: z.array(registryItemTypeSchema).optional(),
      framework: z.enum(['nextjs', 'vite', 'astro', 'custom']).optional(),
      generator: z.custom<(items: RegistryEntry[]) => string>((value) => typeof value === 'function').optional(),
      header: z.string().optional(),
      ssr: z.boolean().optional(),
    })
    .optional(),
  cssTemplates: z
    .object({
      baseLayerRules: z.string().optional(),
      baseStyles: z.string().optional(),
    })
    .optional(),
  extensions: z.array(registryBuildExtensionSchema).optional(),
  importMappings: z
    .object({
      contentRewrites: z
        .array(
          z.object({
            pattern: nonEmptyStringSchema,
            replacement: z.string(),
          }),
        )
        .optional(),
      packageMappings: z.record(registryItemTypeSchema, nonEmptyStringSchema).optional(),
    })
    .optional(),
  output: z
    .object({
      colorsDir: nonEmptyStringSchema.optional(),
      componentIndexDir: nonEmptyStringSchema.optional(),
      componentIndexFile: nonEmptyStringSchema.optional(),
      componentsDir: nonEmptyStringSchema.optional(),
      dir: nonEmptyStringSchema.optional(),
      registryDir: nonEmptyStringSchema.optional(),
      themesCssFile: nonEmptyStringSchema.optional(),
      themesDir: nonEmptyStringSchema.optional(),
    })
    .optional(),
  pipeline: z
    .object({
      components: z.boolean().optional(),
      index: z.boolean().optional(),
    })
    .optional(),
  registries: registryEntriesSchema.optional(),
  registrySource: z.union([z.literal('inline'), nonEmptyStringSchema]).optional(),
  schema: z
    .object({
      itemTypes: z.array(registryItemTypeSchema).optional(),
    })
    .optional(),
  sources: z.record(
    registryItemTypeSchema,
    z.object({
      glob: nonEmptyStringSchema.optional(),
      ignore: z.array(nonEmptyStringSchema).optional(),
      indexStrategy: z.enum(['item', 'file']).optional(),
      packageName: nonEmptyStringSchema.optional(),
      path: nonEmptyStringSchema,
      referencePath: nonEmptyStringSchema.optional(),
    }),
  )
    .optional(),
  stripVariables: z.array(nonEmptyStringSchema).optional(),
  targetPaths: z.record(registryItemTypeSchema, nonEmptyStringSchema).optional(),
  themes: z
    .object({
      cssVarKeys: z.array(nonEmptyStringSchema).optional(),
      data: z.union([nonEmptyStringSchema, themeEntriesSchema]).optional(),
      defaultRadius: nonEmptyStringSchema.optional(),
      names: z.array(nonEmptyStringSchema).optional(),
    })
    .optional(),
})
