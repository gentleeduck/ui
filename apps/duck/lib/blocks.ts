'use server'

import { registryEntrySchema } from '@gentleduck/registers'
import { z } from 'zod'
import { getRegistryIndex } from '~/lib/registry-index.server'

export async function getAllBlockIds(
  types: z.infer<typeof registryEntrySchema>['type'][] = ['registry:block'],
  categories: string[] = [],
): Promise<string[]> {
  const blocks = await getAllBlocks(types, categories)

  return blocks.map((block) => block.name)
}

export async function getAllBlocks(
  types: z.infer<typeof registryEntrySchema>['type'][] = ['registry:block'],
  categories: string[] = [],
) {
  const indexData = getRegistryIndex()
  const index = z.record(z.string(), registryEntrySchema).parse(indexData)

  return Object.values(index).filter((block) => {
    if (!types.includes(block.type)) return false
    if (categories && categories.length > 0) {
      return (block.categories ?? []).some((category) => categories.includes(category))
    }
    return true
  })
}
