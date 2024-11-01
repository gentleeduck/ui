import { z } from 'zod'
import { registry_schema } from '@/registry'

// ----------------------------------------------------------------------------
export async function build_registry_tsx(item: z.infer<typeof registry_schema>[number]) {
  let component_path = `@/registry/${item.root_folder}`
  // TODO: there should be chunk in the item schema
  // TODO: handle the source_file_name for the blocks
  let chunks: z.infer<typeof registry_schema>[number]['chunks'] = []
  const source_file_name: string = ''

  return `
  "${item.name}": {
    name: "${item.name}",
    description: "${item.description ?? ''}",
    type: "${item.type}",
    registryDependencies: ${JSON.stringify(item.registryDependencies)},
    files: [${JSON.stringify(item.files)}],
    component: React.lazy(() => import("${component_path}")),
    source: "${source_file_name}",
    category: "${item.category ?? ''}",
    subcategory: "${item.subcategory ?? ''}",
    chunks: [${chunks.map(
      chunk => `{
      name: "${chunk.name}",
      description: "${chunk.description ?? 'No description'}",
      component: ${chunk.component}
      file: "${chunk.file}",
      container: {
        className: "${chunk.container?.className}"
      }
    }`
    )}]
  },`
}
