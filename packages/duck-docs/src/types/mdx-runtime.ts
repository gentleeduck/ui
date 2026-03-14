export interface NpmCommands {
  __npmCommand__?: string
  __yarnCommand__?: string
  __pnpmCommand__?: string
  __bunCommand__?: string
}

export interface MdxCodeNodeProperties extends NpmCommands {
  __className__?: string
  __event__?: string
  __isMermaid__?: boolean
  __marks__?: string[]
  __mermaidDarkSvg__?: string
  __mermaidLightSvg__?: string
  __rawString__?: string
  __title__?: string
}

export interface MdxNodeData {
  meta?: string
}
