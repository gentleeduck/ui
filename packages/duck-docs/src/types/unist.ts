import type { Node } from 'unist'
import type { IMdxCodeNodeProperties, IMdxNodeData } from './mdx-runtime'

export type { INpmCommands } from './mdx-runtime'

declare module 'unist' {
  interface Data extends IMdxNodeData {}
}

export interface IUnistNode extends Node {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: {
    className?: string[]
    [key: string]: unknown
  } & IMdxCodeNodeProperties
  attributes?: {
    name: string
    value: unknown
    type?: string
  }[]
  children?: IUnistNode[]
}

export interface IUnistTree extends Node {
  children: IUnistNode[]
}
