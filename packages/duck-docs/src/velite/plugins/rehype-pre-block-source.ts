import type { MdxCodeNodeProperties, UnistNode, UnistTree } from '@duck-docs/types'
import type { Nodes } from 'hast'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { assignNodeProperties, readNodeProperties } from './hast-properties'

export function rehypePreBlockSource() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node?.type === 'element' && node?.tagName === 'div' && node?.properties) {
        if (!('data-rehype-pretty-code-fragment' in node.properties)) {
          return
        }

        node.children?.forEach((child: UnistNode) => {
          if (child?.type === 'element' && child?.tagName === 'pre') {
            const currentProperties = readNodeProperties<MdxCodeNodeProperties>(child)
            assignNodeProperties(child, {
              ...currentProperties,
              __rawString__: toString(child as Nodes),
            })
          }
        })
      }
    })
  }
}
