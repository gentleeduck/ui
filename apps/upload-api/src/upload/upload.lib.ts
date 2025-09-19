import { BucketFilesType, BucketFoldersType } from '../globals'
import { NestedObject } from './upload.types'

export function nestObjectsByTreeLevelAndFolderId(data: (BucketFilesType | BucketFoldersType)[]): NestedObject[] {
  const idToItemMap = new Map<string, BucketFoldersType>()
  const roots: (BucketFilesType | BucketFoldersType)[] = []

  // Map all items by their ID and initialize `content` array for folders
  data.forEach((item) => {
    if (item.folder_id) {
      // Store items in the map for potential parents
      if (!idToItemMap.has(item.folder_id)) {
        idToItemMap.set(item.folder_id, {
          content: [],
          id: item.folder_id,
          name: '',
          tree_level: item.tree_level ?? 1 - 1, // Placeholder for parents if not defined
        })
      }
      idToItemMap.get(item.folder_id)!.content!.push(item)
    } else {
      roots.push(item) // No folder_id means it's a root
    }
  })

  console.log(roots)
  return roots
}
