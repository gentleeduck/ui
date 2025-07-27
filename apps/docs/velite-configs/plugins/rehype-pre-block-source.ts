import { Nodes } from 'hast'
import { toString } from 'hast-util-to-string'
import { UnistNode, UnistTree } from '../uniset'
import { visit } from 'unist-util-visit'

export function rehypePreBlockSource() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node?.type === 'element' && node?.tagName === 'div' && node?.properties) {
        if (!('data-rehype-pretty-code-fragment' in node.properties)) {
          return
        }

        node.children?.forEach((child: UnistNode) => {
          if (child?.type === 'element' && child?.tagName === 'pre') {
            console.dir(child, {
              depth: 3,
            })
            child.properties = {
              ...child?.properties,
              __className__: child.properties?.__rawString__,
              __rawString__: toString(child as Nodes),
            }
          }
        })
      }
    })
  }
}
