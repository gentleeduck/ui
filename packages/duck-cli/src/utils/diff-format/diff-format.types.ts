export type DiffLineType = 'context' | 'add' | 'remove' | 'hunk-header' | 'file-header'

export type DiffSegment = {
  text: string
  highlight: boolean
  color?: string
}

export type DiffDisplayLine = {
  type: DiffLineType
  oldLineNum: number | null
  newLineNum: number | null
  segments: DiffSegment[]
  rawText: string
}

export type SideBySidePair = {
  left: DiffDisplayLine | null
  right: DiffDisplayLine | null
}
