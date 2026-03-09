import type { Node } from 'unist'
import type { MdxCodeNodeProperties, MdxNodeData } from './mdx-runtime'

export type { NpmCommands } from './mdx-runtime'

declare module 'unist' {
  interface Data extends MdxNodeData {}
}

export interface UnistNode extends Node {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: {
    className?: string[]
    [key: string]: unknown
  } & MdxCodeNodeProperties
  attributes?: {
    name: string
    value: unknown
    type?: string
  }[]
  children?: UnistNode[]
}

export interface UnistTree extends Node {
  children: UnistNode[]
}
