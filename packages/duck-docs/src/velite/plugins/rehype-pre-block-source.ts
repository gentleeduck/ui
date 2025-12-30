import type { Nodes } from 'hast'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import type { UnistNode, UnistTree } from '@duck-docs/types'

export function rehypePreBlockSource() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node?.type === 'element' && node?.tagName === 'div' && node?.properties) {
        if (!('data-rehype-pretty-code-fragment' in node.properties)) {
          return
        }

        node.children?.forEach((child: UnistNode) => {
          if (child?.type === 'element' && child?.tagName === 'pre') {
            child.properties = {
              ...child?.properties,
              __rawString__: toString(child as Nodes),
            }
          }
        })
      }
    })
  }
}
