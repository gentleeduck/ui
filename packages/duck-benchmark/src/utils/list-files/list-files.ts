import path from 'node:path'
import fs from 'fs-extra'
import { highlighter } from '../text-styling'
import { FolderInfo } from './list-files.dto'
import { ListFilesOptions } from './list-files.types'

export async function list_files({
  cwds,
  depth = Number.POSITIVE_INFINITY,
  filter = [],
  spinner,
}: ListFilesOptions): Promise<FolderInfo[]> {
  async function processDirectory(cwd: string, depth: number): Promise<FolderInfo> {
    if (depth === 0) return {} as FolderInfo
    spinner.text = `Processing directory: ${cwd}`

    const entries = fs.readdirSync(cwd, { withFileTypes: true })
    const stats = fs.statSync(cwd)

    const folderInfo: FolderInfo = {
      createdAt: stats.birthtime,
      files: [],
      modifiedAt: stats.mtime,
      name: path.basename(cwd),
      path: cwd,
      subdirectories: [],
    }

    for (const entry of entries) {
      if (filter.includes(entry.name)) {
        spinner.text = highlighter.warn(`Skipping filtered file/folder: ${entry.name}`)
        continue
      }

      const fullPath = path.join(cwd, entry.name)
      const entryStats = fs.statSync(fullPath)

      if (entry.isDirectory()) {
        spinner.text = `Entering directory: ${fullPath}`
        const subdirectory = await processDirectory(fullPath, depth - 1)
        folderInfo.subdirectories.push(subdirectory)
      } else {
        // Collect file details
        folderInfo.files.push({
          created_at: entryStats.birthtime,
          modified_at: entryStats.mtime,
          name: entry.name,
          path: fullPath,
          size: entryStats.size,
        })
      }
    }

    spinner.text = highlighter.success(`Processed directory: ${cwd}`)
    return folderInfo
  }

  return Promise.all(cwds.map((cwd) => processDirectory(cwd, depth)))
}
