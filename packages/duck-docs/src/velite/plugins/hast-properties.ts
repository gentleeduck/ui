import type { UnistNode } from '@duck-docs/types'

export function readNodeProperties<T extends object>(node: UnistNode): T {
  return (node.properties ?? {}) as T
}

export function assignNodeProperties<T extends object>(node: UnistNode, nextProperties: T) {
  node.properties = {
    ...(node.properties ?? {}),
    ...nextProperties,
  }
}
