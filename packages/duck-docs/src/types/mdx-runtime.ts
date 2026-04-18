export interface INpmCommands {
  __npmCommand__?: string
  __yarnCommand__?: string
  __pnpmCommand__?: string
  __bunCommand__?: string
}

export interface IMdxCodeNodeProperties extends INpmCommands {
  __className__?: string
  __event__?: string
  __isMermaid__?: boolean
  __marks__?: string[]
  __mermaidDarkSvg__?: string
  __mermaidLightSvg__?: string
  __rawString__?: string
  __title__?: string
}

export interface IMdxNodeData {
  meta?: string
}
