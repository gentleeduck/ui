import path from 'node:path'
import fs from 'fs-extra'
import { applyMergeChoices, buildMergeHunks, type Merge } from '~/utils/merge'
import { resolveWithinBase } from '~/utils/safe-path'
import type { ComponentDiff } from './component.service'
import type { ProgressCallback, ServiceResult } from './service.types'

/**
 * `added` auto-resolves to write registry content; `deleted` stays pending until the user
 * chooses keep/remove; `modified` builds hunks via structuredPatch and pre-resolves if empty.
 */
export function buildComponentMergeState(
  componentDiff: ComponentDiff,
  writeTypePath: string,
  root_folder: string,
): Merge.ComponentState {
  const files: Merge.FileState[] = componentDiff.diffs.map((fd) => {
    if (fd.status === 'added') {
      return {
        filePath: fd.filePath,
        status: 'added' as const,
        localContent: '',
        registryContent: fd.registryContent,
        hunks: [],
        fileChoice: 'keep' as const,
        isResolved: true,
      }
    }

    if (fd.status === 'deleted') {
      return {
        filePath: fd.filePath,
        status: 'deleted' as const,
        localContent: fd.localContent,
        registryContent: '',
        hunks: [],
        fileChoice: 'pending' as const,
        isResolved: false,
      }
    }

    const hunks = buildMergeHunks(fd.filePath, fd.localContent, fd.registryContent)
    return {
      filePath: fd.filePath,
      status: 'modified' as const,
      localContent: fd.localContent,
      registryContent: fd.registryContent,
      hunks,
      fileChoice: 'keep' as const,
      isResolved: hunks.length === 0,
    }
  })

  return {
    name: componentDiff.name,
    files,
    writeTypePath,
    root_folder,
  }
}

export function isMergeResolved(mergeState: Merge.ComponentState): boolean {
  return mergeState.files.every((f) => {
    if (f.status === 'deleted') return f.fileChoice !== 'pending'
    if (f.status === 'added') return true
    return f.hunks.every((h) => h.choice !== 'pending')
  })
}

/** Applies per-hunk choices via `applyMergeChoices`; honors `fileChoice='remove'` for deleted files. */
export async function writeMergeResults(
  mergeState: Merge.ComponentState,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<Merge.Result[]>> {
  try {
    const results: Merge.Result[] = []
    // `root_folder` and `file.filePath` are registry-derived; contain both to block path traversal.
    const basePath = resolveWithinBase(mergeState.writeTypePath, mergeState.root_folder)

    for (const file of mergeState.files) {
      const filePath = resolveWithinBase(basePath, file.filePath)

      if (file.status === 'added') {
        onProgress?.(`Writing new file: ${file.filePath}`)
        await fs.ensureDir(path.dirname(filePath))
        await fs.writeFile(filePath, file.registryContent, 'utf8')
        results.push({ filePath: file.filePath, mergedContent: file.registryContent, action: 'write' })
        continue
      }

      if (file.status === 'deleted') {
        if (file.fileChoice === 'remove') {
          onProgress?.(`Removing: ${file.filePath}`)
          if (fs.existsSync(filePath)) {
            await fs.remove(filePath)
          }
          results.push({ filePath: file.filePath, mergedContent: '', action: 'delete' })
        } else {
          results.push({ filePath: file.filePath, mergedContent: file.localContent, action: 'skip' })
        }
        continue
      }

      onProgress?.(`Writing merged: ${file.filePath}`)
      const merged = applyMergeChoices(file.localContent, file.hunks)
      await fs.writeFile(filePath, merged, 'utf8')
      results.push({ filePath: file.filePath, mergedContent: merged, action: 'write' })
    }

    return { ok: true, data: results }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}
