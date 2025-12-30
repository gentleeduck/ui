export function cleanTocItems(items: any[]): any[] {
  return items.map((item) => {
    return {
      ...item,
      items: item.items ? cleanTocItems(item.items) : [],
      title: item.title?.replace('undefined', ''),
    }
  })
}
