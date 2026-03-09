import type { TocEntry } from '@duck-docs/context'

export function cleanTocItems(items: TocEntry[]): TocEntry[] {
  return items.map((item) => {
    return {
      ...item,
      items: item.items ? cleanTocItems(item.items) : [],
      title: item.title?.replace('undefined', ''),
    }
  })
}
