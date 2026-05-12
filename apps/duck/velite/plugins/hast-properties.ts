import type { IUnistNode } from '../types'

/** @internal */
export function readNodeProperties<T extends object>(node: IUnistNode): T {
  return (node.properties ?? {}) as T
}

/** @internal */
export function assignNodeProperties<T extends object>(node: IUnistNode, nextProperties: T) {
  node.properties = {
    ...(node.properties ?? {}),
    ...nextProperties,
  }
}
