import type { Diff } from '~/utils/diff-format'

export type HunkChoice = 'local' | 'registry' | 'both' | 'pending'

export type FileChoice = 'keep' | 'remove' | 'pending'

export type MergeHunk = {
  index: number
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  localLines: string[]
  registryLines: string[]
  contextBefore: string[]
  contextAfter: string[]
  choice: HunkChoice
  displayLines: Diff.DisplayLine[]
}

export type FileMergeState = {
  filePath: string
  status: 'modified' | 'added' | 'deleted'
  localContent: string
  registryContent: string
  hunks: MergeHunk[]
  fileChoice: FileChoice
  isResolved: boolean
}

export type ComponentMergeState = {
  name: string
  files: FileMergeState[]
  writeTypePath: string
  root_folder: string
}

export type MergeResult = {
  filePath: string
  mergedContent: string
  action: 'write' | 'skip' | 'delete'
}
