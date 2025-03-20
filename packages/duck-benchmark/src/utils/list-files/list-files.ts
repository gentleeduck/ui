import path from 'node:path'
import fs from 'fs-extra'
import { ListFilesOptions } from './list-files.types'
import { FolderInfo } from './list-files.dto'

export async function list_files({
  cwds,
  depth = Number.POSITIVE_INFINITY,
  filter = [],
}: ListFilesOptions): Promise<FolderInfo[]> {
  async function processDirectory(
    cwd: string,
    depth: number,
  ): Promise<FolderInfo> {
    if (depth === 0) return {} as FolderInfo

    const entries = fs.readdirSync(cwd, { withFileTypes: true })
    const stats = fs.statSync(cwd)

    const folderInfo: FolderInfo = {
      name: path.basename(cwd),
      path: cwd,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      files: [],
      subdirectories: [],
    }

    for (const entry of entries) {
      if (filter.includes(entry.name)) {
        continue // Skip reading the file/folder if it's in the filter list
      }

      const fullPath = path.join(cwd, entry.name)
      const entryStats = fs.statSync(fullPath)

      if (entry.isDirectory()) {
        // Recursively list subdirectories
        const subdirectory = await processDirectory(fullPath, depth - 1)
        folderInfo.subdirectories.push(subdirectory)
      } else {
        // Collect file details
        folderInfo.files.push({
          name: entry.name,
          path: fullPath,
          size: entryStats.size,
          createdAt: entryStats.birthtime,
          modifiedAt: entryStats.mtime,
          isDirectory: false,
        })
      }
    }

    return folderInfo
  }

  return Promise.all(cwds.map((cwd) => processDirectory(cwd, depth)))
}
