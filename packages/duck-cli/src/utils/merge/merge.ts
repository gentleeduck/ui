import { structuredPatch } from 'diff'
import type { DiffDisplayLine } from '~/utils/diff-format'
import { compute_word_segments, split_segments_by_newline } from '~/utils/diff-format'
import type { MergeHunk } from './merge.types'

/**
 * Build resolvable merge hunks from local and registry content.
 *
 * Uses the `diff` library's structuredPatch to get unified diff hunks.
 * Each hunk contains interleaved context (' '), removed ('-'), and
 * added ('+') lines. We walk through each hunk and extract contiguous
 * change blocks, where each block of removed+added lines becomes one
 * MergeHunk that the user can resolve independently.
 *
 * Line numbers are tracked separately for old (local) and new (registry)
 * to maintain accurate 1-based references for display.
 */
export function build_merge_hunks(file_path: string, local_content: string, registry_content: string): MergeHunk[] {
  const patch = structuredPatch(
    `local/${file_path}`,
    `registry/${file_path}`,
    local_content,
    registry_content,
    'local',
    'registry',
    { context: 3 },
  )

  const hunks: MergeHunk[] = []
  let hunk_index = 0

  for (const hunk of patch.hunks) {
    let i = 0
    const lines = hunk.lines
    let current_old_line = hunk.oldStart
    let current_new_line = hunk.newStart

    while (i < lines.length) {
      // Collect context lines before the change
      const context_before: string[] = []
      while (i < lines.length) {
        const currentLine = lines[i]
        if (!currentLine || currentLine[0] !== ' ') break
        context_before.push(currentLine.substring(1))
        current_old_line++
        current_new_line++
        i++
      }

      if (i >= lines.length) break

      // Skip "no newline" markers
      if (lines[i]?.[0] === '\\') {
        i++
        continue
      }

      // Collect contiguous removed lines (local)
      const local_lines: string[] = []
      const change_old_start = current_old_line
      const change_new_start = current_new_line
      while (i < lines.length) {
        const currentLine = lines[i]
        if (!currentLine || currentLine[0] !== '-') break
        local_lines.push(currentLine.substring(1))
        current_old_line++
        i++
      }

      // Collect contiguous added lines (registry)
      const registry_lines: string[] = []
      while (i < lines.length) {
        const currentLine = lines[i]
        if (!currentLine || currentLine[0] !== '+') break
        registry_lines.push(currentLine.substring(1))
        current_new_line++
        i++
      }

      if (local_lines.length === 0 && registry_lines.length === 0) continue

      // Build display lines for this hunk
      const display_lines = build_hunk_display_lines(
        local_lines,
        registry_lines,
        context_before.slice(-3),
        change_old_start,
        change_new_start,
      )

      // Peek ahead for context_after
      const context_after: string[] = []
      let peek = i
      while (peek < lines.length && context_after.length < 3) {
        const peekLine = lines[peek]
        if (!peekLine || peekLine[0] !== ' ') break
        context_after.push(peekLine.substring(1))
        peek++
      }

      hunks.push({
        index: hunk_index++,
        old_start: change_old_start,
        old_lines: local_lines.length,
        new_start: change_new_start,
        new_lines: registry_lines.length,
        local_lines,
        registry_lines,
        context_before: context_before.slice(-3),
        context_after,
        choice: 'pending',
        display_lines,
      })
    }
  }

  return hunks
}

/**
 * Build DiffDisplayLine[] for a single change block with word-level highlighting.
 */
function build_hunk_display_lines(
  local_lines: string[],
  registry_lines: string[],
  context_before: string[],
  old_start: number,
  new_start: number,
): DiffDisplayLine[] {
  const lines: DiffDisplayLine[] = []
  let old_line = old_start - context_before.length
  let new_line = new_start - context_before.length

  // Context before
  for (const ctx of context_before) {
    lines.push({
      type: 'context',
      old_line_num: old_line,
      new_line_num: new_line,
      segments: [{ text: ctx, highlight: false }],
      raw_text: ctx,
    })
    old_line++
    new_line++
  }

  // Compute word-level segments if both sides have content
  if (local_lines.length > 0 && registry_lines.length > 0) {
    const old_block = local_lines.join('\n')
    const new_block = registry_lines.join('\n')
    const { removed_segments, added_segments } = compute_word_segments(old_block, new_block)

    const removed_line_segs = split_segments_by_newline(removed_segments)
    const added_line_segs = split_segments_by_newline(added_segments)

    for (let k = 0; k < local_lines.length; k++) {
      const localLine = local_lines[k]
      if (localLine == null) continue
      lines.push({
        type: 'remove',
        old_line_num: old_start + k,
        new_line_num: null,
        segments: removed_line_segs[k] ?? [{ text: localLine, highlight: false }],
        raw_text: localLine,
      })
    }
    for (let k = 0; k < registry_lines.length; k++) {
      const registryLine = registry_lines[k]
      if (registryLine == null) continue
      lines.push({
        type: 'add',
        old_line_num: null,
        new_line_num: new_start + k,
        segments: added_line_segs[k] ?? [{ text: registryLine, highlight: false }],
        raw_text: registryLine,
      })
    }
  } else if (local_lines.length > 0) {
    // Pure removal
    for (let k = 0; k < local_lines.length; k++) {
      const localLine = local_lines[k]
      if (localLine == null) continue
      lines.push({
        type: 'remove',
        old_line_num: old_start + k,
        new_line_num: null,
        segments: [{ text: localLine, highlight: false }],
        raw_text: localLine,
      })
    }
  } else {
    // Pure addition
    for (let k = 0; k < registry_lines.length; k++) {
      const registryLine = registry_lines[k]
      if (registryLine == null) continue
      lines.push({
        type: 'add',
        old_line_num: null,
        new_line_num: new_start + k,
        segments: [{ text: registryLine, highlight: false }],
        raw_text: registryLine,
      })
    }
  }

  return lines
}

/**
 * Reconstruct the merged file content from local content and resolved hunks.
 *
 * Walks through sorted hunks in order of their position in the local file.
 * Between hunks, copies unchanged local lines. For each hunk, emits the
 * chosen side based on the user's resolution:
 *   'local' or 'pending': keep local lines (pending defaults to local)
 *   'registry': replace with registry lines
 *   'both': concatenate local then registry lines
 *
 * local_cursor is a 0-based index into local_lines.
 * hunk.old_start is 1-based, so we convert with hunk_start_0 = old_start - 1.
 */
export function apply_merge_choices(local_content: string, hunks: MergeHunk[]): string {
  const local_lines = local_content.split('\n')
  const result: string[] = []
  let local_cursor = 0 // 0-based index into local_lines

  const sorted = [...hunks].sort((a, b) => a.old_start - b.old_start)

  for (const hunk of sorted) {
    const hunk_start_0 = hunk.old_start - 1 // convert to 0-based

    // Copy unchanged lines before this hunk
    while (local_cursor < hunk_start_0) {
      const localLine = local_lines[local_cursor]
      if (localLine != null) {
        result.push(localLine)
      }
      local_cursor++
    }

    switch (hunk.choice) {
      case 'local':
      case 'pending':
        // Keep local lines
        for (const line of hunk.local_lines) {
          result.push(line)
        }
        break
      case 'registry':
        // Use registry lines
        for (const line of hunk.registry_lines) {
          result.push(line)
        }
        break
      case 'both':
        // Local first, then registry
        for (const line of hunk.local_lines) {
          result.push(line)
        }
        for (const line of hunk.registry_lines) {
          result.push(line)
        }
        break
    }

    // Skip past the local lines consumed by this hunk
    local_cursor += hunk.old_lines
  }

  // Copy remaining lines after the last hunk
  while (local_cursor < local_lines.length) {
    const localLine = local_lines[local_cursor]
    if (localLine != null) {
      result.push(localLine)
    }
    local_cursor++
  }

  return result.join('\n')
}

/**
 * Build a preview of the merged file for the summary step.
 *
 * Resolved hunks show their chosen content as context lines.
 * Unresolved hunks show git-style conflict markers:
 *   <<<<<<< LOCAL
 *   (local lines)
 *   =======
 *   (registry lines)
 *   >>>>>>> REGISTRY
 */
export function build_merge_preview_lines(local_content: string, hunks: MergeHunk[]): DiffDisplayLine[] {
  const local_lines = local_content.split('\n')
  const result: DiffDisplayLine[] = []
  let local_cursor = 0
  let output_line = 1

  const sorted = [...hunks].sort((a, b) => a.old_start - b.old_start)

  for (const hunk of sorted) {
    const hunk_start_0 = hunk.old_start - 1

    // Unchanged lines before this hunk
    while (local_cursor < hunk_start_0) {
      const localLine = local_lines[local_cursor]
      if (localLine != null) {
        result.push({
          type: 'context',
          old_line_num: output_line,
          new_line_num: output_line,
          segments: [{ text: localLine, highlight: false }],
          raw_text: localLine,
        })
      }
      output_line++
      local_cursor++
    }

    if (hunk.choice === 'pending') {
      // Show conflict markers
      result.push({
        type: 'hunk-header',
        old_line_num: null,
        new_line_num: null,
        segments: [{ text: '<<<<<<< LOCAL', highlight: false }],
        raw_text: '<<<<<<< LOCAL',
      })
      for (const line of hunk.local_lines) {
        result.push({
          type: 'remove',
          old_line_num: output_line,
          new_line_num: null,
          segments: [{ text: line, highlight: false }],
          raw_text: line,
        })
        output_line++
      }
      result.push({
        type: 'file-header',
        old_line_num: null,
        new_line_num: null,
        segments: [{ text: '=======', highlight: false }],
        raw_text: '=======',
      })
      for (const line of hunk.registry_lines) {
        result.push({
          type: 'add',
          old_line_num: null,
          new_line_num: output_line,
          segments: [{ text: line, highlight: false }],
          raw_text: line,
        })
        output_line++
      }
      result.push({
        type: 'hunk-header',
        old_line_num: null,
        new_line_num: null,
        segments: [{ text: '>>>>>>> REGISTRY', highlight: false }],
        raw_text: '>>>>>>> REGISTRY',
      })
    } else {
      // Resolved -- show chosen lines
      const chosen_lines =
        hunk.choice === 'local'
          ? hunk.local_lines
          : hunk.choice === 'registry'
            ? hunk.registry_lines
            : [...hunk.local_lines, ...hunk.registry_lines]

      for (const line of chosen_lines) {
        result.push({
          type: 'context',
          old_line_num: output_line,
          new_line_num: output_line,
          segments: [{ text: line, highlight: false }],
          raw_text: line,
        })
        output_line++
      }
    }

    local_cursor += hunk.old_lines
  }

  // Remaining lines
  while (local_cursor < local_lines.length) {
    const localLine = local_lines[local_cursor]
    if (localLine != null) {
      result.push({
        type: 'context',
        old_line_num: output_line,
        new_line_num: output_line,
        segments: [{ text: localLine, highlight: false }],
        raw_text: localLine,
      })
    }
    output_line++
    local_cursor++
  }

  return result
}
