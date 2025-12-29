import { visit } from 'unist-util-visit'
import { UnistNode, UnistTree } from '../uniset'

export function rhypeMetadataPlugin() {
  return (tree: UnistTree): UnistTree => {
    visit(tree, 'element', (node: UnistNode) => {
      if (node.tagName === 'code' && node.children) {
        let match = {} as any

        if (node.data?.meta) {
          const meta = node.data?.meta as string

          match.__title__ = (meta?.match(/title="([^"]*)"/) ?? [])[1]

          match.__marks__ = [...meta?.matchAll(/\/([^/]+)\//g)].map((m) => m[1])
        }

        // @ts-ignore
        // node.data.meta = node.data.meta?.replace(/\/([^/]+)\//g, '')
        node.properties = {
          ...node.properties,
          __rawString__: node.children?.[0]?.value,
          ...match,
        }
      }
    })

    return tree
  }
}
