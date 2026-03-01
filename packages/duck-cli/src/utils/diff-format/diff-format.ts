import { diffWords, structuredPatch } from 'diff'
import type { DiffDisplayLine, DiffSegment, SideBySidePair } from './diff-format.types'

/**
 * Compute word-level diff segments between two text blocks.
 * Uses diffWords to identify changed words, producing separate
 * segment arrays for removed (old) and added (new) text.
 * Each segment is tagged with highlight=true if it represents a change.
 */
export function compute_word_segments(
  old_text: string,
  new_text: string,
): { removed_segments: DiffSegment[]; added_segments: DiffSegment[] } {
  const changes = diffWords(old_text, new_text)
  const removed_segments: DiffSegment[] = []
  const added_segments: DiffSegment[] = []

  for (const change of changes) {
    if (change.added) {
      added_segments.push({ text: change.value, highlight: true })
    } else if (change.removed) {
      removed_segments.push({ text: change.value, highlight: true })
    } else {
      removed_segments.push({ text: change.value, highlight: false })
      added_segments.push({ text: change.value, highlight: false })
    }
  }

  return { removed_segments, added_segments }
}

/** Pad a line number to the given width, or return spaces if null. */
export function format_line_number(num: number | null, width: number): string {
  if (num === null) return ' '.repeat(width)
  return String(num).padStart(width)
}

/**
 * Generate a unified diff view as an array of DiffDisplayLine objects.
 *
 * Uses structuredPatch for the raw diff, then walks each hunk to:
 * 1. Emit file-header lines (--- local, +++ registry)
 * 2. Emit hunk-header lines (@@ -old,count +new,count @@)
 * 3. For each change block, compute word-level highlights by joining
 *    contiguous removed/added lines and running compute_word_segments,
 *    then splitting back into per-line segments.
 */
export function build_display_lines(
  file_path: string,
  local_content: string,
  registry_content: string,
): DiffDisplayLine[] {
  const patch = structuredPatch(
    `local/${file_path}`,
    `registry/${file_path}`,
    local_content,
    registry_content,
    'local',
    'registry',
    { context: 3 },
  )

  const lines: DiffDisplayLine[] = []

  // File header lines
  lines.push({
    type: 'file-header',
    old_line_num: null,
    new_line_num: null,
    segments: [{ text: `--- local: ${file_path}`, highlight: false }],
    raw_text: `--- local: ${file_path}`,
  })
  lines.push({
    type: 'file-header',
    old_line_num: null,
    new_line_num: null,
    segments: [{ text: `+++ registry: ${file_path}`, highlight: false }],
    raw_text: `+++ registry: ${file_path}`,
  })

  for (const hunk of patch.hunks) {
    const hunk_header = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`
    lines.push({
      type: 'hunk-header',
      old_line_num: null,
      new_line_num: null,
      segments: [{ text: hunk_header, highlight: false }],
      raw_text: hunk_header,
    })

    let old_line = hunk.oldStart
    let new_line = hunk.newStart
    const hunk_lines = hunk.lines
    let i = 0

    while (i < hunk_lines.length) {
      const line = hunk_lines[i]
      const prefix = line[0]
      const content = line.substring(1)

      if (prefix === ' ') {
        // Context line
        lines.push({
          type: 'context',
          old_line_num: old_line,
          new_line_num: new_line,
          segments: [{ text: content, highlight: false }],
          raw_text: content,
        })
        old_line++
        new_line++
        i++
      } else if (prefix === '-') {
        // Collect contiguous removed lines
        const removed_lines: string[] = []
        let j = i
        while (j < hunk_lines.length && hunk_lines[j][0] === '-') {
          removed_lines.push(hunk_lines[j].substring(1))
          j++
        }
        // Collect contiguous added lines that follow
        const added_lines: string[] = []
        while (j < hunk_lines.length && hunk_lines[j][0] === '+') {
          added_lines.push(hunk_lines[j].substring(1))
          j++
        }

        if (added_lines.length > 0) {
          // Word-level diff between the blocks
          const old_block = removed_lines.join('\n')
          const new_block = added_lines.join('\n')
          const { removed_segments, added_segments } = compute_word_segments(old_block, new_block)

          // Split segments back into per-line groups
          const removed_line_segments = split_segments_by_newline(removed_segments)
          const added_line_segments = split_segments_by_newline(added_segments)

          for (let k = 0; k < removed_lines.length; k++) {
            lines.push({
              type: 'remove',
              old_line_num: old_line,
              new_line_num: null,
              segments: removed_line_segments[k] ?? [{ text: removed_lines[k], highlight: false }],
              raw_text: removed_lines[k],
            })
            old_line++
          }
          for (let k = 0; k < added_lines.length; k++) {
            lines.push({
              type: 'add',
              old_line_num: null,
              new_line_num: new_line,
              segments: added_line_segments[k] ?? [{ text: added_lines[k], highlight: false }],
              raw_text: added_lines[k],
            })
            new_line++
          }
        } else {
          // Pure removal, no word-level diff
          for (const removed of removed_lines) {
            lines.push({
              type: 'remove',
              old_line_num: old_line,
              new_line_num: null,
              segments: [{ text: removed, highlight: false }],
              raw_text: removed,
            })
            old_line++
          }
        }

        i = j
      } else if (prefix === '+') {
        // Pure addition (not paired with removal)
        lines.push({
          type: 'add',
          old_line_num: null,
          new_line_num: new_line,
          segments: [{ text: content, highlight: false }],
          raw_text: content,
        })
        new_line++
        i++
      } else {
        // Skip lines without a recognized prefix (e.g. "\ No newline at end of file")
        i++
      }
    }
  }

  return lines
}

/**
 * Split a flat array of diff segments into per-line groups,
 * breaking at newline characters within segment text.
 *
 * Used after word-level diffing where segments span multiple lines
 * (e.g. from joining lines with '\n' before calling diffWords).
 * The output aligns segments back to individual source lines.
 */
export function split_segments_by_newline(segments: DiffSegment[]): DiffSegment[][] {
  const result: DiffSegment[][] = [[]]

  for (const seg of segments) {
    const parts = seg.text.split('\n')
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        result.push([])
      }
      if (parts[i].length > 0) {
        result[result.length - 1].push({ text: parts[i], highlight: seg.highlight })
      }
    }
  }

  return result
}

/**
 * Convert a unified diff line array into side-by-side pairs.
 * Contiguous remove+add blocks are paired left/right,
 * with null padding on the shorter side.
 */
export function build_side_by_side_pairs(lines: DiffDisplayLine[]): SideBySidePair[] {
  const pairs: SideBySidePair[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.type === 'file-header' || line.type === 'hunk-header' || line.type === 'context') {
      pairs.push({ left: line, right: line })
      i++
    } else if (line.type === 'remove') {
      // Collect contiguous removes
      const removes: DiffDisplayLine[] = []
      while (i < lines.length && lines[i].type === 'remove') {
        removes.push(lines[i])
        i++
      }
      // Collect contiguous adds
      const adds: DiffDisplayLine[] = []
      while (i < lines.length && lines[i].type === 'add') {
        adds.push(lines[i])
        i++
      }
      // Pair them, padding the shorter side
      const max_len = Math.max(removes.length, adds.length)
      for (let j = 0; j < max_len; j++) {
        pairs.push({
          left: j < removes.length ? removes[j] : null,
          right: j < adds.length ? adds[j] : null,
        })
      }
    } else if (line.type === 'add') {
      // Pure addition
      pairs.push({ left: null, right: line })
      i++
    } else {
      i++
    }
  }

  return pairs
}

/** Find the highest line number across all lines for gutter width calculation. */
export function get_max_line_number(lines: DiffDisplayLine[]): number {
  let max = 0
  for (const line of lines) {
    if (line.old_line_num !== null && line.old_line_num > max) max = line.old_line_num
    if (line.new_line_num !== null && line.new_line_num > max) max = line.new_line_num
  }
  return max
}

/** Return array indices of hunk-header lines, used for n/p keyboard navigation. */
export function get_hunk_offsets(lines: DiffDisplayLine[]): number[] {
  const offsets: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].type === 'hunk-header') {
      offsets.push(i)
    }
  }
  return offsets
}
