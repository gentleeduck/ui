import { Ora } from 'ora'
import { FileInfo, FolderInfo } from '../list-files'

export type CompileBenchmarkParams = {
  folders: FolderInfo[]
  visited?: Set<string>
  spinner: Ora
  cwd: string
}

export type CompileFileParams = { file: FileInfo; spinner: Ora; cwd: string }

export type RenderBenchmarkParams = {
  folders: FolderInfo[]
  visited?: Set<string>
  spinner: Ora
  cwd: string
}
