import type { UnistNode, UnistTree } from '@duck-docs/types'
import { visit } from 'unist-util-visit'

export function rehypeTitle() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node?.type === 'element' && node?.tagName === 'div' && node?.properties) {
        if (!('data-rehype-pretty-code-fragment' in node.properties)) {
          return
        }

        node.children?.forEach((child: UnistNode) => {
          if (
            child.type === 'element' &&
            child.tagName === 'div' &&
            Object.keys(child.properties ?? {}).includes('data-rehype-pretty-code-title')
          ) {
            child.tagName = 'figcaption'
          }
        })
      }
    })
  }
}
