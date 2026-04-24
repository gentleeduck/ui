import type { JSDocableNode } from 'ts-morph'

export type DuckgenMessagesTag = {
  groupKey?: string
}

// 🦆 Parse @duckgen tags on JSDoc, optionally extracting a group key.
// 🦆 Supported:
// 🦆 - @duckgen
// 🦆 - @duckgen messages
// 🦆 - @duckgen messages auth
// 🦆 - @duckgen auth
export function parseDuckgenMessagesTag(node: JSDocableNode): DuckgenMessagesTag | null {
  for (const doc of node.getJsDocs()) {
    for (const tag of doc.getTags()) {
      if (tag.getTagName() !== 'duckgen') continue
      const raw = tag.getComment()
      const comment = typeof raw === 'string' ? raw.trim() : ''
      if (!comment) return {}

      const parts = comment.split(/\s+/).filter(Boolean)
      if (parts.length === 0) return {}

      const first = parts[0]?.toLowerCase()
      if (first === 'messages' || first === 'message') {
        const groupKey = parts[1]
        return groupKey ? { groupKey } : {}
      }

      return { groupKey: parts[0] }
    }
  }
  return null
}
