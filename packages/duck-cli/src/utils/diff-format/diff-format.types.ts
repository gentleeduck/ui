export namespace Diff {
  export type LineType = 'context' | 'add' | 'remove' | 'hunk-header' | 'file-header'

  export interface Segment {
    text: string
    highlight: boolean
    color?: string
  }

  export interface DisplayLine {
    type: LineType
    oldLineNum: number | null
    newLineNum: number | null
    segments: Segment[]
    rawText: string
  }

  export interface SideBySidePair {
    left: DisplayLine | null
    right: DisplayLine | null
  }

  export type ViewMode = 'unified' | 'side-by-side'

  export interface RenderableSegment extends Segment {
    key: string
  }
}
