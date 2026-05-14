import type { IUnistNode } from '../types'

export function readNodeProperties<T extends object>(node: IUnistNode): T {
  return (node.properties ?? {}) as T
}

export function assignNodeProperties<T extends object>(node: IUnistNode, nextProperties: T) {
  node.properties = {
    ...(node.properties ?? {}),
    ...nextProperties,
  }
}
