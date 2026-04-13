import type { IMdxCodeNodeProperties, IUnistNode, IUnistTree } from '@duck-docs/types'
import type { Nodes } from 'hast'
import { toString as hastToString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { assignNodeProperties, readNodeProperties } from './hast-properties'

export function rehypePreBlockSource() {
  return (tree: IUnistTree) => {
    visit(tree, (node: IUnistNode) => {
      if (node?.type === 'element' && node?.tagName === 'div' && node?.properties) {
        if (!('data-rehype-pretty-code-fragment' in node.properties)) {
          return
        }

        node.children?.forEach((child: IUnistNode) => {
          if (child?.type === 'element' && child?.tagName === 'pre') {
            const currentProperties = readNodeProperties<IMdxCodeNodeProperties>(child)
            assignNodeProperties(child, {
              ...currentProperties,
              __rawString__: hastToString(child as Nodes),
            })
          }
        })
      }
    })
  }
}
