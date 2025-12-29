import { Nodes } from 'hast'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'
import { UnistNode, UnistTree } from '../uniset'

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
            // child.children?.push({
            //   type: 'element',
            //   tagName: 'figcaption',
            //   properties: {},
            //   children: [
            //     {
            //       type: 'text',
            //       value: toString(child?.children?.[0] as any)
            //         .split('\n')[0]!
            //         .replace('//', ''),
            //     },
            //   ],
            // })
          }
        })
      }
    })
  }
}
