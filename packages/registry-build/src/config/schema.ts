import { z } from 'zod'
import type { IRegistryBuildExtension } from '../extensions/extension'
import type { IRegistryEntry } from '../extensions/ui/ui.registry.types'
import { registryEntryListSchema, registryItemTypeSchema, themeEntriesSchema } from '../extensions/ui/ui.schema'

const nonEmptyStringSchema = z.string().trim().min(1)

export {
  registryEntryListSchema,
  registryEntrySchema,
  registryItemTypeSchema,
  themeEntriesSchema,
} from '../extensions/ui/ui.schema'

export const registryEntriesSchema = z.record(z.string(), registryEntryListSchema)

export const registryBuildSourceSchema = z.object({
  glob: nonEmptyStringSchema.optional(),
  ignore: z.array(nonEmptyStringSchema).optional(),
  indexStrategy: z.enum(['item', 'file']).optional(),
  packageName: nonEmptyStringSchema.optional(),
  path: nonEmptyStringSchema,
  referencePath: nonEmptyStringSchema.optional(),
})

export const registryBuildCollectionSchema = z.object({
  data: z.unknown().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  sources: z.record(nonEmptyStringSchema, registryBuildSourceSchema).optional(),
})

export const registryBuildExtensionSchema = z.custom<IRegistryBuildExtension>((value) => {
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
  branding: z
    .object({
      font: nonEmptyStringSchema.optional(),
      name: nonEmptyStringSchema.optional(),
    })
    .optional(),
  collections: z.record(z.string(), registryBuildCollectionSchema).optional(),
  colors: z
    .object({
      data: z.union([nonEmptyStringSchema, z.record(z.string(), z.unknown())]).optional(),
    })
    .optional(),
  componentIndex: z
    .object({
      excludeTypes: z.array(registryItemTypeSchema).optional(),
      framework: z.enum(['nextjs', 'vite', 'custom']).optional(),
      generator: z.custom<(items: IRegistryEntry[]) => string>((value) => typeof value === 'function').optional(),
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
  extends: z.union([nonEmptyStringSchema, z.array(nonEmptyStringSchema)]).optional(),
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
  performance: z
    .object({
      cacheDir: nonEmptyStringSchema.optional(),
      incremental: z.boolean().optional(),
      parallelism: z.number().int().positive().optional(),
    })
    .optional(),
  registries: registryEntriesSchema.optional(),
  registrySource: z.union([z.literal('inline'), nonEmptyStringSchema]).optional(),
  schema: z
    .object({
      itemTypes: z.array(registryItemTypeSchema).optional(),
    })
    .optional(),
  sources: z.record(registryItemTypeSchema, registryBuildSourceSchema).optional(),
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
