import type { Diff } from '~/utils/diff-format'

export namespace Merge {
  export type HunkChoice = 'local' | 'registry' | 'both' | 'pending'

  export type FileChoice = 'keep' | 'remove' | 'pending'

  export interface Hunk {
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

  export interface FileState {
    filePath: string
    status: 'modified' | 'added' | 'deleted'
    localContent: string
    registryContent: string
    hunks: Hunk[]
    fileChoice: FileChoice
    isResolved: boolean
  }

  export interface ComponentState {
    name: string
    files: FileState[]
    writeTypePath: string
    root_folder: string
  }

  export interface Result {
    filePath: string
    mergedContent: string
    action: 'write' | 'skip' | 'delete'
  }

  export type Step = 'loading' | 'select' | 'diffing' | 'resolving' | 'summary' | 'writing' | 'done' | 'error'
}
