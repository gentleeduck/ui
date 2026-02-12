import type { Node } from 'unist'

declare module 'unist' {
  interface Data {
    meta?: string
  }
}

export interface UnistNode extends Node {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: {
    __rawString__?: string
    __className__?: string
    __title__?: string
    __marks__?: string[]
    __event__?: string
    __isMermaid__?: boolean
    __mermaidLightSvg__?: string
    __mermaidDarkSvg__?: string
    className?: string[]
    [key: string]: unknown
  } & NpmCommands
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

export interface NpmCommands {
  __npmCommand__?: string
  __yarnCommand__?: string
  __pnpmCommand__?: string
  __bunCommand__?: string
}
