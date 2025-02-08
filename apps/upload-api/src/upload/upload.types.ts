import { BucketFilesType, BucketFoldersType } from '../globals'

export interface NestedObject extends BucketFilesType, BucketFoldersType {
  children?: NestedObject[]
}
