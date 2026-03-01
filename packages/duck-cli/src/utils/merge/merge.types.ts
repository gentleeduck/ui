import type { DiffDisplayLine } from '~/utils/diff-format'

export type HunkChoice = 'local' | 'registry' | 'both' | 'pending'

export type FileChoice = 'keep' | 'remove' | 'pending'

export type MergeHunk = {
  index: number
  old_start: number
  old_lines: number
  new_start: number
  new_lines: number
  local_lines: string[]
  registry_lines: string[]
  context_before: string[]
  context_after: string[]
  choice: HunkChoice
  display_lines: DiffDisplayLine[]
}

export type FileMergeState = {
  file_path: string
  status: 'modified' | 'added' | 'deleted'
  local_content: string
  registry_content: string
  hunks: MergeHunk[]
  file_choice: FileChoice
  is_resolved: boolean
}

export type ComponentMergeState = {
  name: string
  files: FileMergeState[]
  write_type_path: string
  root_folder: string
}

export type MergeResult = {
  file_path: string
  merged_content: string
  action: 'write' | 'skip' | 'delete'
}
