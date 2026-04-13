import { structuredPatch } from 'diff'
import type { Diff } from '~/utils/diff-format'
import { computeWordSegments, splitSegmentsByNewline } from '~/utils/diff-format'
import type { Merge } from './merge.types'

/**
 * Build resolvable merge hunks from local and registry content.
 *
 * Uses the `diff` library's structuredPatch to get unified diff hunks.
 * Each hunk contains interleaved context (' '), removed ('-'), and
 * added ('+') lines. We walk through each hunk and extract contiguous
 * change blocks, where each block of removed+added lines becomes one
 * Merge.Hunk that the user can resolve independently.
 *
 * Line numbers are tracked separately for old (local) and new (registry)
 * to maintain accurate 1-based references for display.
 */
export function buildMergeHunks(filePath: string, localContent: string, registryContent: string): Merge.Hunk[] {
  const patch = structuredPatch(
    `local/${filePath}`,
    `registry/${filePath}`,
    localContent,
    registryContent,
    'local',
    'registry',
    { context: 3 },
  )

  const hunks: Merge.Hunk[] = []
  let hunkIndex = 0

  for (const hunk of patch.hunks) {
    let i = 0
    const lines = hunk.lines
    let currentOldLine = hunk.oldStart
    let currentNewLine = hunk.newStart

    while (i < lines.length) {
      // Collect context lines before the change
      const contextBefore: string[] = []
      while (i < lines.length) {
        const currentLine = lines[i]
        if (!currentLine || currentLine[0] !== ' ') break
        contextBefore.push(currentLine.substring(1))
        currentOldLine++
        currentNewLine++
        i++
      }

      if (i >= lines.length) break

      // Skip "no newline" markers
      if (lines[i]?.[0] === '\\') {
        i++
        continue
      }

      // Collect contiguous removed lines (local)
      const localLines: string[] = []
      const changeOldStart = currentOldLine
      const changeNewStart = currentNewLine
      while (i < lines.length) {
        const currentLine = lines[i]
        if (!currentLine || currentLine[0] !== '-') break
        localLines.push(currentLine.substring(1))
        currentOldLine++
        i++
      }

      // Collect contiguous added lines (registry)
      const registryLines: string[] = []
      while (i < lines.length) {
        const currentLine = lines[i]
        if (!currentLine || currentLine[0] !== '+') break
        registryLines.push(currentLine.substring(1))
        currentNewLine++
        i++
      }

      if (localLines.length === 0 && registryLines.length === 0) continue

      // Build display lines for this hunk
      const displayLines = buildHunkDisplayLines(
        localLines,
        registryLines,
        contextBefore.slice(-3),
        changeOldStart,
        changeNewStart,
      )

      // Peek ahead for contextAfter
      const contextAfter: string[] = []
      let peek = i
      while (peek < lines.length && contextAfter.length < 3) {
        const peekLine = lines[peek]
        if (!peekLine || peekLine[0] !== ' ') break
        contextAfter.push(peekLine.substring(1))
        peek++
      }

      hunks.push({
        index: hunkIndex++,
        oldStart: changeOldStart,
        oldLines: localLines.length,
        newStart: changeNewStart,
        newLines: registryLines.length,
        localLines,
        registryLines,
        contextBefore: contextBefore.slice(-3),
        contextAfter,
        choice: 'pending',
        displayLines,
      })
    }
  }

  return hunks
}

/**
 * Build Diff.DisplayLine[] for a single change block with word-level highlighting.
 */
function buildHunkDisplayLines(
  localLines: string[],
  registryLines: string[],
  contextBefore: string[],
  oldStart: number,
  newStart: number,
): Diff.DisplayLine[] {
  const lines: Diff.DisplayLine[] = []
  let oldLine = oldStart - contextBefore.length
  let newLine = newStart - contextBefore.length

  // Context before
  for (const ctx of contextBefore) {
    lines.push({
      type: 'context',
      oldLineNum: oldLine,
      newLineNum: newLine,
      segments: [{ text: ctx, highlight: false }],
      rawText: ctx,
    })
    oldLine++
    newLine++
  }

  // Compute word-level segments if both sides have content
  if (localLines.length > 0 && registryLines.length > 0) {
    const oldBlock = localLines.join('\n')
    const newBlock = registryLines.join('\n')
    const { removedSegments, addedSegments } = computeWordSegments(oldBlock, newBlock)

    const removedLineSegs = splitSegmentsByNewline(removedSegments)
    const addedLineSegs = splitSegmentsByNewline(addedSegments)

    for (let k = 0; k < localLines.length; k++) {
      const localLine = localLines[k]
      if (localLine == null) continue
      lines.push({
        type: 'remove',
        oldLineNum: oldStart + k,
        newLineNum: null,
        segments: removedLineSegs[k] ?? [{ text: localLine, highlight: false }],
        rawText: localLine,
      })
    }
    for (let k = 0; k < registryLines.length; k++) {
      const registryLine = registryLines[k]
      if (registryLine == null) continue
      lines.push({
        type: 'add',
        oldLineNum: null,
        newLineNum: newStart + k,
        segments: addedLineSegs[k] ?? [{ text: registryLine, highlight: false }],
        rawText: registryLine,
      })
    }
  } else if (localLines.length > 0) {
    // Pure removal
    for (let k = 0; k < localLines.length; k++) {
      const localLine = localLines[k]
      if (localLine == null) continue
      lines.push({
        type: 'remove',
        oldLineNum: oldStart + k,
        newLineNum: null,
        segments: [{ text: localLine, highlight: false }],
        rawText: localLine,
      })
    }
  } else {
    // Pure addition
    for (let k = 0; k < registryLines.length; k++) {
      const registryLine = registryLines[k]
      if (registryLine == null) continue
      lines.push({
        type: 'add',
        oldLineNum: null,
        newLineNum: newStart + k,
        segments: [{ text: registryLine, highlight: false }],
        rawText: registryLine,
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
 * localCursor is a 0-based index into localLines.
 * hunk.oldStart is 1-based, so we convert with hunkStart0 = oldStart - 1.
 */
export function applyMergeChoices(localContent: string, hunks: Merge.Hunk[]): string {
  const localLines = localContent.split('\n')
  const result: string[] = []
  let localCursor = 0 // 0-based index into localLines

  const sorted = [...hunks].sort((a, b) => a.oldStart - b.oldStart)

  for (const hunk of sorted) {
    const hunkStart0 = hunk.oldStart - 1 // convert to 0-based

    // Copy unchanged lines before this hunk
    while (localCursor < hunkStart0) {
      const localLine = localLines[localCursor]
      if (localLine != null) {
        result.push(localLine)
      }
      localCursor++
    }

    switch (hunk.choice) {
      case 'local':
      case 'pending':
        // Keep local lines
        for (const line of hunk.localLines) {
          result.push(line)
        }
        break
      case 'registry':
        // Use registry lines
        for (const line of hunk.registryLines) {
          result.push(line)
        }
        break
      case 'both':
        // Local first, then registry
        for (const line of hunk.localLines) {
          result.push(line)
        }
        for (const line of hunk.registryLines) {
          result.push(line)
        }
        break
    }

    // Skip past the local lines consumed by this hunk
    localCursor += hunk.oldLines
  }

  // Copy remaining lines after the last hunk
  while (localCursor < localLines.length) {
    const localLine = localLines[localCursor]
    if (localLine != null) {
      result.push(localLine)
    }
    localCursor++
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
export function buildMergePreviewLines(localContent: string, hunks: Merge.Hunk[]): Diff.DisplayLine[] {
  const localLines = localContent.split('\n')
  const result: Diff.DisplayLine[] = []
  let localCursor = 0
  let outputLine = 1

  const sorted = [...hunks].sort((a, b) => a.oldStart - b.oldStart)

  for (const hunk of sorted) {
    const hunkStart0 = hunk.oldStart - 1

    // Unchanged lines before this hunk
    while (localCursor < hunkStart0) {
      const localLine = localLines[localCursor]
      if (localLine != null) {
        result.push({
          type: 'context',
          oldLineNum: outputLine,
          newLineNum: outputLine,
          segments: [{ text: localLine, highlight: false }],
          rawText: localLine,
        })
      }
      outputLine++
      localCursor++
    }

    if (hunk.choice === 'pending') {
      // Show conflict markers
      result.push({
        type: 'hunk-header',
        oldLineNum: null,
        newLineNum: null,
        segments: [{ text: '<<<<<<< LOCAL', highlight: false }],
        rawText: '<<<<<<< LOCAL',
      })
      for (const line of hunk.localLines) {
        result.push({
          type: 'remove',
          oldLineNum: outputLine,
          newLineNum: null,
          segments: [{ text: line, highlight: false }],
          rawText: line,
        })
        outputLine++
      }
      result.push({
        type: 'file-header',
        oldLineNum: null,
        newLineNum: null,
        segments: [{ text: '=======', highlight: false }],
        rawText: '=======',
      })
      for (const line of hunk.registryLines) {
        result.push({
          type: 'add',
          oldLineNum: null,
          newLineNum: outputLine,
          segments: [{ text: line, highlight: false }],
          rawText: line,
        })
        outputLine++
      }
      result.push({
        type: 'hunk-header',
        oldLineNum: null,
        newLineNum: null,
        segments: [{ text: '>>>>>>> REGISTRY', highlight: false }],
        rawText: '>>>>>>> REGISTRY',
      })
    } else {
      // Resolved -- show chosen lines
      const chosenLines =
        hunk.choice === 'local'
          ? hunk.localLines
          : hunk.choice === 'registry'
            ? hunk.registryLines
            : [...hunk.localLines, ...hunk.registryLines]

      for (const line of chosenLines) {
        result.push({
          type: 'context',
          oldLineNum: outputLine,
          newLineNum: outputLine,
          segments: [{ text: line, highlight: false }],
          rawText: line,
        })
        outputLine++
      }
    }

    localCursor += hunk.oldLines
  }

  // Remaining lines
  while (localCursor < localLines.length) {
    const localLine = localLines[localCursor]
    if (localLine != null) {
      result.push({
        type: 'context',
        oldLineNum: outputLine,
        newLineNum: outputLine,
        segments: [{ text: localLine, highlight: false }],
        rawText: localLine,
      })
    }
    outputLine++
    localCursor++
  }

  return result
}
