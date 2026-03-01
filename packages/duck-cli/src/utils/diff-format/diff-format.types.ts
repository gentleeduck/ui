export type DiffLineType = 'context' | 'add' | 'remove' | 'hunk-header' | 'file-header'

export type DiffSegment = {
  text: string
  highlight: boolean
  color?: string
}

export type DiffDisplayLine = {
  type: DiffLineType
  old_line_num: number | null
  new_line_num: number | null
  segments: DiffSegment[]
  raw_text: string
}

export type SideBySidePair = {
  left: DiffDisplayLine | null
  right: DiffDisplayLine | null
}
