export interface INpmCommands {
  npm?: string
  yarn?: string
  pnpm?: string
  bun?: string
}

export interface IMdxCodeNodeProperties extends INpmCommands {
  __className__?: string
  __dmcEvent__?: string
  __isMermaid__?: boolean
  __marks__?: string[]
  __dmcDarkSvg__?: string
  __dmcLightSvg__?: string
  __dmcRaw__?: string
  __title__?: string
}

export interface IMdxNodeData {
  meta?: string
}
