import { visit } from 'unist-util-visit'
import type { IUnistNode, IUnistTree } from '../types'

export function rehypeTitle() {
  return (tree: IUnistTree) => {
    visit(tree, (node: IUnistNode) => {
      if (node?.type === 'element' && node?.tagName === 'div' && node?.properties) {
        if (!('data-dmc-fragment' in node.properties)) {
          return
        }

        node.children?.forEach((child: IUnistNode) => {
          if (
            child.type === 'element' &&
            child.tagName === 'div' &&
            Object.keys(child.properties ?? {}).includes('data-dmc-title')
          ) {
            child.tagName = 'figcaption'
          }
        })
      }
    })
  }
}
