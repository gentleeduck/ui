import fs from 'node:fs/promises'
import path from 'node:path'

/** Checks whether a file or directory exists at the given path. */
export async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readFileIfExists(filePath: string) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined
    }

    throw error
  }
}

/** Writes content to a file only if it differs from the existing content. Returns whether the file was written. */
export async function writeFileIfChanged(filePath: string, content: string) {
  const existingContent = await readFileIfExists(filePath)

  if (existingContent === content) {
    return false
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')
  return true
}

/** Writes a JSON-serialized value to a file only if it differs from the existing content. */
export async function writeJsonIfChanged(filePath: string, value: unknown) {
  return writeFileIfChanged(filePath, JSON.stringify(value, null, 2))
}

/** Recursively lists all file paths under the given directory, sorted alphabetically. */
export async function listFilesRecursively(targetPath: string): Promise<string[]> {
  if (!(await pathExists(targetPath))) {
    return []
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true })
  const nestedPaths = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(targetPath, entry.name)

      if (entry.isDirectory()) {
        return listFilesRecursively(entryPath)
      }

      return [entryPath]
    }),
  )

  return nestedPaths.flat().sort((left, right) => left.localeCompare(right))
}

/** Deletes files from `previousPaths` that are no longer present in `currentPaths`. Returns the removed paths. */
export async function removeStaleFiles(currentPaths: string[], previousPaths: string[]) {
  const currentPathSet = new Set(currentPaths)
  const removedPaths: string[] = []

  for (const previousPath of previousPaths) {
    if (currentPathSet.has(previousPath)) {
      continue
    }

    await fs.rm(previousPath, { force: true })
    removedPaths.push(previousPath)
  }

  return removedPaths
}
