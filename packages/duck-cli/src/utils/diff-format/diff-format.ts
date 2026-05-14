import { diffWords, structuredPatch } from 'diff'
import type { Diff } from './diff-format.types'

/** Splits each `diffWords` change into removed/added segment streams, with `highlight=true` for changed runs. */
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

export function formatLineNumber(num: number | null, width: number): string {
  if (num === null) return ' '.repeat(width)
  return String(num).padStart(width)
}

/**
 * Walks the `structuredPatch` output and pairs contiguous remove+add blocks through
 * `computeWordSegments` to get word-level highlighting before splitting back to per-line segments.
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
        // Greedily group contiguous `-` lines followed by contiguous `+` lines so word-level
        // diffing has both sides as a single text block.
        const removedLines: string[] = []
        let j = i
        while (j < hunkLines.length) {
          const removedLine = hunkLines[j]
          if (!removedLine || removedLine[0] !== '-') break
          removedLines.push(removedLine.substring(1))
          j++
        }
        const addedLines: string[] = []
        while (j < hunkLines.length) {
          const addedLine = hunkLines[j]
          if (!addedLine || addedLine[0] !== '+') break
          addedLines.push(addedLine.substring(1))
          j++
        }

        if (addedLines.length > 0) {
          const oldBlock = removedLines.join('\n')
          const newBlock = addedLines.join('\n')
          const { removedSegments, addedSegments } = computeWordSegments(oldBlock, newBlock)

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
        // Bare `+` not preceded by `-` (we'd have consumed it in the block above otherwise).
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
        // e.g. `\ No newline at end of file`.
        i++
      }
    }
  }

  return lines
}

/** Inverse of joining lines with `\n` for `diffWords`: re-aligns segments back to per-line arrays. */
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

/** Pairs contiguous remove/add runs left/right; shorter side gets null padding. */
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
      const removes: Diff.DisplayLine[] = []
      while (i < lines.length) {
        const removeLine = lines[i]
        if (!removeLine || removeLine.type !== 'remove') break
        removes.push(removeLine)
        i++
      }
      const adds: Diff.DisplayLine[] = []
      while (i < lines.length) {
        const addLine = lines[i]
        if (!addLine || addLine.type !== 'add') break
        adds.push(addLine)
        i++
      }
      const maxLen = Math.max(removes.length, adds.length)
      for (let j = 0; j < maxLen; j++) {
        pairs.push({
          left: removes[j] ?? null,
          right: adds[j] ?? null,
        })
      }
    } else if (line.type === 'add') {
      pairs.push({ left: null, right: line })
      i++
    } else {
      i++
    }
  }

  return pairs
}

/** Used to size the gutter column to the widest line number. */
export function getMaxLineNumber(lines: Diff.DisplayLine[]): number {
  let max = 0
  for (const line of lines) {
    if (line.oldLineNum !== null && line.oldLineNum > max) max = line.oldLineNum
    if (line.newLineNum !== null && line.newLineNum > max) max = line.newLineNum
  }
  return max
}

/** Indices of `hunk-header` rows; consumed by the n/p key handler to jump between hunks. */
export function getHunkOffsets(lines: Diff.DisplayLine[]): number[] {
  const offsets: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]?.type === 'hunk-header') {
      offsets.push(i)
    }
  }
  return offsets
}
