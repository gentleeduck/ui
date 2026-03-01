import type { MdxCodeNodeProperties, UnistNode, UnistTree } from '@duck-docs/types'
import { visit } from 'unist-util-visit'
import { assignNodeProperties } from './hast-properties'
import { parseCodeFenceMeta } from './metadata-utils'

export function rehypeMetadataPlugin() {
  return (tree: UnistTree): UnistTree => {
    visit(tree, 'element', (node: UnistNode) => {
      if (node.tagName === 'code' && node.children) {
        const nextProperties: Partial<MdxCodeNodeProperties> = {
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

// Backward-compatible alias kept for downstream consumers.
export const rhypeMetadataPlugin = rehypeMetadataPlugin
