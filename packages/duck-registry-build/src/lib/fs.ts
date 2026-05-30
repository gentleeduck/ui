import fs from 'node:fs/promises'
import path from 'node:path'
import { isPathWithinBases } from './safe-path'

export async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

// Swallows ENOENT, rethrows everything else.
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

// Returns whether the file was actually written (skipped when content matches),
// so watchers downstream don't see a useless mtime bump on no-op rebuilds.
export async function writeFileIfChanged(filePath: string, content: string) {
  const existingContent = await readFileIfExists(filePath)

  if (existingContent === content) {
    return false
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')
  return true
}

export async function writeJsonIfChanged(filePath: string, value: unknown) {
  return writeFileIfChanged(filePath, JSON.stringify(value, null, 2))
}

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

/**
 * Delete every path in `previousPaths` that is not in `currentPaths`, but only
 * after asserting the path lives inside one of `allowedBaseDirs`. The base-dir
 * check exists because `previousPaths` typically comes from a cached manifest
 * on disk (`build-cache.json`) — a tampered cache that schema-passes can still
 * carry absolute paths like `/etc/passwd`. Containment is the defense of last
 * resort before `fs.rm`. Paths outside the allow-list are skipped (logged) and
 * never unlinked.
 */
export async function removeStaleFiles(
  currentPaths: string[],
  previousPaths: string[],
  allowedBaseDirs: readonly string[],
) {
  if (allowedBaseDirs.length === 0) {
    throw new Error('removeStaleFiles requires at least one allowed base dir for containment.')
  }

  const currentPathSet = new Set(currentPaths)
  const removedPaths: string[] = []

  for (const previousPath of previousPaths) {
    if (currentPathSet.has(previousPath)) {
      continue
    }

    if (!isPathWithinBases(previousPath, allowedBaseDirs)) {
      // Refuse to delete a cached path that escapes every allowed base. This
      // is the safety net against a tampered `build-cache.json` whose envelope
      // and per-phase schema pass but whose `outputFiles` entries point at
      // attacker-chosen locations on disk.
      console.warn(`[registry-build] refusing to delete stale path outside allowed dirs: ${previousPath}`)
      continue
    }

    await fs.rm(previousPath, { force: true })
    removedPaths.push(previousPath)
  }

  return removedPaths
}
