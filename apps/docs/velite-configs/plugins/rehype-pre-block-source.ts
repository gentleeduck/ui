import { Nodes } from 'hast'
import { toString } from 'hast-util-to-string'
import { UnistNode, UnistTree } from '../uniset'

export function rehypePreBlockSource() {
  return (tree: UnistTree): UnistTree => {
    return {
      ...tree,
      children: tree.children.map((node: UnistNode) => {
        if (node?.type === 'element' && node?.tagName === 'div') {
          if (!('data-rehype-pretty-code-fragment' in node.properties!)) {
            return node
          }

          return {
            ...node,
            children: node.children?.map((child: UnistNode) => {
              if (child?.tagName !== 'pre') {
                return child
              }

              return {
                ...child,
                properties: {
                  ...child?.properties,
                  __rawString__: toString(child as Nodes),
                },
              }
            }),
          }
        }
        return node
      }),
    }
  }
}
