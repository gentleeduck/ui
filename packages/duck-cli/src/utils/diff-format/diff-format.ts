import { diffWords, structuredPatch } from 'diff'
import type { Diff } from './diff-format.types'

/**
 * Compute word-level diff segments between two text blocks.
 * Uses diffWords to identify changed words, producing separate
 * segment arrays for removed (old) and added (new) text.
 * Each segment is tagged with highlight=true if it represents a change.
 */
export function computeWordSegments(
  oldText: string,
  newText: string,
): { removedSegments: Diff.Segment[]; addedSegments: Diff.Segment[] } {
  const changes = diffWords(oldText, newText)
  const removedSegments: Diff.Segment[] = []
  const addedSegments: Diff.Segment[] = []

  for (const change of changes) {
    if (change.added) {
      addedSegments.push({ text: change.value, highlight: true })
    } else if (change.removed) {
      removedSegments.push({ text: change.value, highlight: true })
    } else {
      removedSegments.push({ text: change.value, highlight: false })
      addedSegments.push({ text: change.value, highlight: false })
    }
  }

  return { removedSegments, addedSegments }
}

/** Pad a line number to the given width, or return spaces if null. */
export function formatLineNumber(num: number | null, width: number): string {
  if (num === null) return ' '.repeat(width)
  return String(num).padStart(width)
}

/**
 * Generate a unified diff view as an array of Diff.DisplayLine objects.
 *
 * Uses structuredPatch for the raw diff, then walks each hunk to:
 * 1. Emit file-header lines (--- local, +++ registry)
 * 2. Emit hunk-header lines (@@ -old,count +new,count @@)
 * 3. For each change block, compute word-level highlights by joining
 *    contiguous removed/added lines and running computeWordSegments,
 *    then splitting back into per-line segments.
 */
export function buildDisplayLines(filePath: string, localContent: string, registryContent: string): Diff.DisplayLine[] {
  const patch = structuredPatch(
    `local/${filePath}`,
    `registry/${filePath}`,
    localContent,
    registryContent,
    'local',
    'registry',
    { context: 3 },
  )

  const lines: Diff.DisplayLine[] = []

  // File header lines
  lines.push({
    type: 'file-header',
    oldLineNum: null,
    newLineNum: null,
    segments: [{ text: `--- local: ${filePath}`, highlight: false }],
    rawText: `--- local: ${filePath}`,
  })
  lines.push({
    type: 'file-header',
    oldLineNum: null,
    newLineNum: null,
    segments: [{ text: `+++ registry: ${filePath}`, highlight: false }],
    rawText: `+++ registry: ${filePath}`,
  })

  for (const hunk of patch.hunks) {
    const hunkHeader = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`
    lines.push({
      type: 'hunk-header',
      oldLineNum: null,
      newLineNum: null,
      segments: [{ text: hunkHeader, highlight: false }],
      rawText: hunkHeader,
    })

    let oldLine = hunk.oldStart
    let newLine = hunk.newStart
    const hunkLines = hunk.lines
    let i = 0

    while (i < hunkLines.length) {
      const line = hunkLines[i]
      if (!line) {
        i++
        continue
      }
      const prefix = line[0]
      const content = line.substring(1)

      if (prefix === ' ') {
        // Context line
        lines.push({
          type: 'context',
          oldLineNum: oldLine,
          newLineNum: newLine,
          segments: [{ text: content, highlight: false }],
          rawText: content,
        })
        oldLine++
        newLine++
        i++
      } else if (prefix === '-') {
        // Collect contiguous removed lines
        const removedLines: string[] = []
        let j = i
        while (j < hunkLines.length) {
          const removedLine = hunkLines[j]
          if (!removedLine || removedLine[0] !== '-') break
          removedLines.push(removedLine.substring(1))
          j++
        }
        // Collect contiguous added lines that follow
        const addedLines: string[] = []
        while (j < hunkLines.length) {
          const addedLine = hunkLines[j]
          if (!addedLine || addedLine[0] !== '+') break
          addedLines.push(addedLine.substring(1))
          j++
        }

        if (addedLines.length > 0) {
          // Word-level diff between the blocks
          const oldBlock = removedLines.join('\n')
          const newBlock = addedLines.join('\n')
          const { removedSegments, addedSegments } = computeWordSegments(oldBlock, newBlock)

          // Split segments back into per-line groups
          const removedLineSegments = splitSegmentsByNewline(removedSegments)
          const addedLineSegments = splitSegmentsByNewline(addedSegments)

          for (let k = 0; k < removedLines.length; k++) {
            const removedLine = removedLines[k]
            if (removedLine == null) continue
            lines.push({
              type: 'remove',
              oldLineNum: oldLine,
              newLineNum: null,
              segments: removedLineSegments[k] ?? [{ text: removedLine, highlight: false }],
              rawText: removedLine,
            })
            oldLine++
          }
          for (let k = 0; k < addedLines.length; k++) {
            const addedLine = addedLines[k]
            if (addedLine == null) continue
            lines.push({
              type: 'add',
              oldLineNum: null,
              newLineNum: newLine,
              segments: addedLineSegments[k] ?? [{ text: addedLine, highlight: false }],
              rawText: addedLine,
            })
            newLine++
          }
        } else {
          // Pure removal, no word-level diff
          for (const removed of removedLines) {
            lines.push({
              type: 'remove',
              oldLineNum: oldLine,
              newLineNum: null,
              segments: [{ text: removed, highlight: false }],
              rawText: removed,
            })
            oldLine++
          }
        }

        i = j
      } else if (prefix === '+') {
        // Pure addition (not paired with removal)
        lines.push({
          type: 'add',
          oldLineNum: null,
          newLineNum: newLine,
          segments: [{ text: content, highlight: false }],
          rawText: content,
        })
        newLine++
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
export function splitSegmentsByNewline(segments: Diff.Segment[]): Diff.Segment[][] {
  const result: Diff.Segment[][] = [[]]

  for (const seg of segments) {
    const parts = seg.text.split('\n')
    for (const [index, part] of parts.entries()) {
      if (index > 0) {
        result.push([])
      }
      if (part.length > 0) {
        const currentLine = result.at(-1)
        currentLine?.push({ text: part, highlight: seg.highlight })
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
export function buildSideBySidePairs(lines: Diff.DisplayLine[]): Diff.SideBySidePair[] {
  const pairs: Diff.SideBySidePair[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line) {
      i++
      continue
    }

    if (line.type === 'file-header' || line.type === 'hunk-header' || line.type === 'context') {
      pairs.push({ left: line, right: line })
      i++
    } else if (line.type === 'remove') {
      // Collect contiguous removes
      const removes: Diff.DisplayLine[] = []
      while (i < lines.length) {
        const removeLine = lines[i]
        if (!removeLine || removeLine.type !== 'remove') break
        removes.push(removeLine)
        i++
      }
      // Collect contiguous adds
      const adds: Diff.DisplayLine[] = []
      while (i < lines.length) {
        const addLine = lines[i]
        if (!addLine || addLine.type !== 'add') break
        adds.push(addLine)
        i++
      }
      // Pair them, padding the shorter side
      const maxLen = Math.max(removes.length, adds.length)
      for (let j = 0; j < maxLen; j++) {
        pairs.push({
          left: removes[j] ?? null,
          right: adds[j] ?? null,
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
export function getMaxLineNumber(lines: Diff.DisplayLine[]): number {
  let max = 0
  for (const line of lines) {
    if (line.oldLineNum !== null && line.oldLineNum > max) max = line.oldLineNum
    if (line.newLineNum !== null && line.newLineNum > max) max = line.newLineNum
  }
  return max
}

/** Return array indices of hunk-header lines, used for n/p keyboard navigation. */
export function getHunkOffsets(lines: Diff.DisplayLine[]): number[] {
  const offsets: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]?.type === 'hunk-header') {
      offsets.push(i)
    }
  }
  return offsets
}
