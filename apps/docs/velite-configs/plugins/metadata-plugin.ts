import { UnistNode, UnistTree } from '../uniset'
import { visit } from 'unist-util-visit'

export function metadataPlugin() {
  return (tree: UnistTree): UnistTree => {
    visit(tree, 'element', (node: UnistNode) => {
      if (node.tagName === 'code' && node.children) {
        let match = [] as unknown as RegExpExecArray

        if (node.data?.meta) {
          match = [
            ...match,
            ((node.data.meta as string).match(/event="([^"]*)"/) ?? [])[1],
          ] as unknown as RegExpExecArray
        }

        node.properties = {
          ...node.properties,
          __rawString__: node.children?.[0]?.value,
          __event__: match?.[0],
        }
      }
    })

    return tree
  }
}
