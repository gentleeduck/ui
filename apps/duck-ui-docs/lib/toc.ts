// TODO: I'll fix this later.

import { toc } from 'mdast-util-toc'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'

const textTypes = ['text', 'emphasis', 'strong', 'inlineCode']
// @ts-expect-error Parameter 'node' implicitly has an 'any' type.ts(7006)
function flattenNode(node) {
  // @ts-expect-error Parameter 'node' implicitly has an 'any' type.ts(7006)
  const p = []
  visit(node, (node) => {
    if (!textTypes.includes(node.type)) return
    p.push(node.value)
  })
  // @ts-expect-error Parameter 'node' implicitly has an 'any' type.ts(7006)
  return p.join(``)
}

interface Item {
  title: string
  url: string
  items?: Item[]
}

interface Items {
  items?: Item[]
}
// @ts-expect-error Parameter 'node' implicitly has an 'any' type.ts(7006)
function getItems(node, current): Items {
  if (!node) {
    return {}
  }

  if (node.type === 'paragraph') {
    visit(node, (item) => {
      if (item.type === 'link') {
        current.url = item.url
        current.title = flattenNode(node)
      }

      if (item.type === 'text') {
        current.title = flattenNode(node)
      }
    })

    return current
  }

  if (node.type === 'list') {
    // @ts-expect-error Parameter 'node' implicitly has an 'any' type.ts(7006)
    current.items = node.children.map((i) => getItems(i, {}))

    return current
  } else if (node.type === 'listItem') {
    const heading = getItems(node.children[0], {})

    if (node.children.length > 1) {
      getItems(node.children[1], heading)
    }

    return heading
  }

  return {}
}
// @ts-expect-error Parameter 'node' implicitly has an 'any' type.ts(7006)
const getToc = () => (node, file) => {
  const table = toc(node)
  const items = getItems(table.map, {})

  file.data = items
}

export type TableOfContents = Items

export async function getTableOfContents(content: string): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content)

  return result.data
}
