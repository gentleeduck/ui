import path from 'node:path'
import fs from 'fs-extra'
import {
  applyMergeChoices,
  buildMergeHunks,
  type ComponentMergeState,
  type FileMergeState,
  type MergeResult,
} from '~/utils/merge'
import type { ComponentDiff } from './component.service'
import type { ProgressCallback, ServiceResult } from './service.types'

/**
 * Build the initial merge state from a ComponentDiff.
 *
 * File status handling:
 * - Added files: auto-resolved (isResolved=true), will write registry content.
 * - Deleted files: pending user decision (keep local or remove).
 * - Modified files: builds merge hunks via structuredPatch, marks resolved
 *   only if there are no change hunks (files are identical).
 */
export function buildComponentMergeState(
  componentDiff: ComponentDiff,
  writeTypePath: string,
  root_folder: string,
): ComponentMergeState {
  const files: FileMergeState[] = componentDiff.diffs.map((fd) => {
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

    // Modified
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

/**
 * Check if all files in a merge state are fully resolved.
 */
export function isMergeResolved(mergeState: ComponentMergeState): boolean {
  return mergeState.files.every((f) => {
    if (f.status === 'deleted') return f.fileChoice !== 'pending'
    if (f.status === 'added') return true
    return f.hunks.every((h) => h.choice !== 'pending')
  })
}

/**
 * Write resolved merge decisions to disk.
 *
 * - Added files: writes registry content to new file.
 * - Deleted files: removes if fileChoice='remove', else skips.
 * - Modified files: applies hunk choices via applyMergeChoices
 *   to produce the merged content, then writes to disk.
 */
export async function writeMergeResults(
  mergeState: ComponentMergeState,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<MergeResult[]>> {
  try {
    const results: MergeResult[] = []
    const basePath = path.join(mergeState.writeTypePath, mergeState.root_folder)

    for (const file of mergeState.files) {
      const filePath = path.join(basePath, file.filePath)

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

      // Modified -- apply hunk choices
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
