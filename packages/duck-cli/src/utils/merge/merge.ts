import { structuredPatch } from 'diff'
import type { Diff } from '~/utils/diff-format'
import { computeWordSegments, splitSegmentsByNewline } from '~/utils/diff-format'
import type { Merge } from './merge.types'

/**
 * Splits each `structuredPatch` hunk into one `Merge.Hunk` per contiguous remove+add block so each
 * change can be resolved independently. Tracks old/new line numbers separately for 1-based display.
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

      // `\ No newline at end of file` marker.
      if (lines[i]?.[0] === '\\') {
        i++
        continue
      }

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

      const registryLines: string[] = []
      while (i < lines.length) {
        const currentLine = lines[i]
        if (!currentLine || currentLine[0] !== '+') break
        registryLines.push(currentLine.substring(1))
        currentNewLine++
        i++
      }

      if (localLines.length === 0 && registryLines.length === 0) continue

      const displayLines = buildHunkDisplayLines(
        localLines,
        registryLines,
        contextBefore.slice(-3),
        changeOldStart,
        changeNewStart,
      )

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

  // Both sides present => run word-level diff so the user can see exactly what changed within lines.
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
 * Resolution map: `local`/`pending` keeps local lines (pending defaults safely to local),
 * `registry` replaces with registry lines, `both` concatenates local then registry.
 */
export function applyMergeChoices(localContent: string, hunks: Merge.Hunk[]): string {
  const localLines = localContent.split('\n')
  const result: string[] = []
  let localCursor = 0

  const sorted = [...hunks].sort((a, b) => a.oldStart - b.oldStart)

  for (const hunk of sorted) {
    // `oldStart` is 1-based in the `diff` library.
    const hunkStart0 = hunk.oldStart - 1

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
        for (const line of hunk.localLines) {
          result.push(line)
        }
        break
      case 'registry':
        for (const line of hunk.registryLines) {
          result.push(line)
        }
        break
      case 'both':
        for (const line of hunk.localLines) {
          result.push(line)
        }
        for (const line of hunk.registryLines) {
          result.push(line)
        }
        break
    }

    localCursor += hunk.oldLines
  }

  while (localCursor < localLines.length) {
    const localLine = localLines[localCursor]
    if (localLine != null) {
      result.push(localLine)
    }
    localCursor++
  }

  return result.join('\n')
}

/** Renders unresolved hunks as git-style `<<<<<<< LOCAL / ======= / >>>>>>> REGISTRY` markers. */
export function buildMergePreviewLines(localContent: string, hunks: Merge.Hunk[]): Diff.DisplayLine[] {
  const localLines = localContent.split('\n')
  const result: Diff.DisplayLine[] = []
  let localCursor = 0
  let outputLine = 1

  const sorted = [...hunks].sort((a, b) => a.oldStart - b.oldStart)

  for (const hunk of sorted) {
    const hunkStart0 = hunk.oldStart - 1

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
