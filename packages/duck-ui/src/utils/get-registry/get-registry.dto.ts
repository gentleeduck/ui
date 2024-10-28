import { z } from 'zod'

// TODO: Extract this to a shared package.
export const registry_item_type_cchema = z.enum([
  'components:style',
  'components:lib',
  'components:example',
  'components:block',
  'components:component',
  'components:ui',
  'components:hook',
  'components:theme',
  'components:page'
])

export const registry_item_file_schema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registry_item_type_cchema,
  target: z.string().optional()
})

export const registry_item_tailwind_schema = z.object({
  config: z
    .object({
      content: z.array(z.string()).optional(),
      theme: z.record(z.string(), z.any()).optional(),
      plugins: z.array(z.string()).optional()
    })
    .optional()
})

export const registry_item_css_vars_schema = z.object({
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional()
})

export const registry_item_schema = z.object({
  name: z.string(),
  type: registry_item_type_cchema,
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registry_item_file_schema).optional(),
  tailwind: registry_item_tailwind_schema.optional(),
  cssVars: registry_item_css_vars_schema.optional(),
  meta: z.record(z.string(), z.any()).optional(),
  docs: z.string().optional()
})

export type RegistryItem = z.infer<typeof registry_item_schema>

export const registry_index_schema = z.array(
  registry_item_schema.extend({
    files: z.array(z.union([z.string(), registry_item_file_schema])).optional()
  })
)

export const styles_schema = z.array(
  z.object({
    name: z.string(),
    label: z.string()
  })
)

export const registry_base_color_schema = z.object({
  inlineColors: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string())
  }),
  cssVars: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string())
  }),
  inlineColorsTemplate: z.string(),
  cssVarsTemplate: z.string()
})

export const registry_resolved_items_tree_schema = registry_item_schema.pick({
  dependencies: true,
  devDependencies: true,
  files: true,
  tailwind: true,
  cssVars: true,
  docs: true
})
