import { FolderInfo } from '../list-files'

export type CompileBenchmarkParams = {
  folders: FolderInfo[]
  visited?: Set<string>
}
