'use server'

import { registry_entry_schema } from '@gentleduck/registers'
import { z } from 'zod'
import { Index } from '~/__ui_registry__'

export async function getAllBlockIds(
  types: z.infer<typeof registry_entry_schema>['type'][] = ['registry:block'],
  categories: string[] = [],
): Promise<string[]> {
  const blocks = await getAllBlocks(types, categories)

  return blocks.map((block) => block.name)
}

export async function getAllBlocks(
  types: z.infer<typeof registry_entry_schema>['type'][] = ['registry:block'],
  categories: string[] = [],
) {
  const index = z.record(registry_entry_schema).parse(Index)

  return Object.values(index).filter((block) => {
    if (!types.includes(block.type)) return false
    // Only include blocks that match at least one of the requested categories when categories are provided
    if (categories && categories.length > 0) {
      return (block.categories ?? []).some((category) => categories.includes(category))
    }
      //     &&
    // (categories.length === 0 || block.categories?.some((category) => categories.includes(category))) &&
    // !block.name.startsWith('chart-'),
    return true
  })
}
