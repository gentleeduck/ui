import type { ITocEntry } from '@duck-docs/context'

export function cleanTocItems(items: ITocEntry[]): ITocEntry[] {
  return items.map((item) => {
    return {
      ...item,
      items: item.items ? cleanTocItems(item.items) : [],
      title: item.title?.replace('undefined', ''),
    }
  })
}
