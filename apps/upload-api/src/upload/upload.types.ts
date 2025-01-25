import { FilesMutationType, FoldersMutationType } from '../globals'

export interface NestedObject extends FilesMutationType, FoldersMutationType {
  children?: NestedObject[]
}
