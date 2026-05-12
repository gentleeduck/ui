import { visit } from 'unist-util-visit'
import type { IMdxCodeNodeProperties, IUnistNode, IUnistTree } from '../types'
import { assignNodeProperties } from './hast-properties'
import { parseCodeFenceMeta } from './metadata-utils'

export function rehypeMetadataPlugin() {
  return (tree: IUnistTree): IUnistTree => {
    visit(tree, 'element', (node: IUnistNode) => {
      if (node.tagName === 'code' && node.children) {
        const nextProperties: Partial<IMdxCodeNodeProperties> = {
          __rawString__: node.children?.[0]?.value,
        }

        if (node.data?.meta) {
          const parsed = parseCodeFenceMeta(node.data.meta as string)
          nextProperties.__title__ = parsed.title
          nextProperties.__marks__ = parsed.marks
        }

        assignNodeProperties(node, nextProperties)
      }
    })

    return tree
  }
}

/**
 * Backward-compatible alias kept for downstream consumers.
 * @internal
 * @deprecated Use {@link rehypeMetadataPlugin} instead.
 */
export const rhypeMetadataPlugin = rehypeMetadataPlugin
