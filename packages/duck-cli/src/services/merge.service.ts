import path from 'node:path'
import fs from 'fs-extra'
import {
  apply_merge_choices,
  build_merge_hunks,
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
 * - Added files: auto-resolved (is_resolved=true), will write registry content.
 * - Deleted files: pending user decision (keep local or remove).
 * - Modified files: builds merge hunks via structuredPatch, marks resolved
 *   only if there are no change hunks (files are identical).
 */
export function build_component_merge_state(
  component_diff: ComponentDiff,
  write_type_path: string,
  root_folder: string,
): ComponentMergeState {
  const files: FileMergeState[] = component_diff.diffs.map((fd) => {
    if (fd.status === 'added') {
      return {
        file_path: fd.file_path,
        status: 'added' as const,
        local_content: '',
        registry_content: fd.registry_content,
        hunks: [],
        file_choice: 'keep' as const,
        is_resolved: true,
      }
    }

    if (fd.status === 'deleted') {
      return {
        file_path: fd.file_path,
        status: 'deleted' as const,
        local_content: fd.local_content,
        registry_content: '',
        hunks: [],
        file_choice: 'pending' as const,
        is_resolved: false,
      }
    }

    // Modified
    const hunks = build_merge_hunks(fd.file_path, fd.local_content, fd.registry_content)
    return {
      file_path: fd.file_path,
      status: 'modified' as const,
      local_content: fd.local_content,
      registry_content: fd.registry_content,
      hunks,
      file_choice: 'keep' as const,
      is_resolved: hunks.length === 0,
    }
  })

  return {
    name: component_diff.name,
    files,
    write_type_path,
    root_folder,
  }
}

/**
 * Check if all files in a merge state are fully resolved.
 */
export function is_merge_resolved(merge_state: ComponentMergeState): boolean {
  return merge_state.files.every((f) => {
    if (f.status === 'deleted') return f.file_choice !== 'pending'
    if (f.status === 'added') return true
    return f.hunks.every((h) => h.choice !== 'pending')
  })
}

/**
 * Write resolved merge decisions to disk.
 *
 * - Added files: writes registry content to new file.
 * - Deleted files: removes if file_choice='remove', else skips.
 * - Modified files: applies hunk choices via apply_merge_choices
 *   to produce the merged content, then writes to disk.
 */
export async function write_merge_results(
  merge_state: ComponentMergeState,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<MergeResult[]>> {
  try {
    const results: MergeResult[] = []
    const base_path = path.join(merge_state.write_type_path, merge_state.root_folder)

    for (const file of merge_state.files) {
      const file_path = path.join(base_path, file.file_path)

      if (file.status === 'added') {
        onProgress?.(`Writing new file: ${file.file_path}`)
        await fs.ensureDir(path.dirname(file_path))
        await fs.writeFile(file_path, file.registry_content, 'utf8')
        results.push({ file_path: file.file_path, merged_content: file.registry_content, action: 'write' })
        continue
      }

      if (file.status === 'deleted') {
        if (file.file_choice === 'remove') {
          onProgress?.(`Removing: ${file.file_path}`)
          if (fs.existsSync(file_path)) {
            await fs.remove(file_path)
          }
          results.push({ file_path: file.file_path, merged_content: '', action: 'delete' })
        } else {
          results.push({ file_path: file.file_path, merged_content: file.local_content, action: 'skip' })
        }
        continue
      }

      // Modified -- apply hunk choices
      onProgress?.(`Writing merged: ${file.file_path}`)
      const merged = apply_merge_choices(file.local_content, file.hunks)
      await fs.writeFile(file_path, merged, 'utf8')
      results.push({ file_path: file.file_path, merged_content: merged, action: 'write' })
    }

    return { ok: true, data: results }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}
