import type { UnistNode } from '@duck-docs/types'

/** @internal */
export function readNodeProperties<T extends object>(node: UnistNode): T {
  return (node.properties ?? {}) as T
}

/** @internal */
export function assignNodeProperties<T extends object>(node: UnistNode, nextProperties: T) {
  node.properties = {
    ...(node.properties ?? {}),
    ...nextProperties,
  }
}
