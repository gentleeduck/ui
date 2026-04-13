import type { DiffDisplayLine, DiffSegment, SideBySidePair } from '~/utils/diff-format'

export type RenderableDiffSegment = DiffSegment & {
  key: string
}

export function getRenderableDiffSegments(segments: DiffSegment[]): RenderableDiffSegment[] {
  const occurrences = new Map<string, number>()

  return segments.map((segment) => {
    const fingerprint = `${segment.text}\u0000${segment.highlight}\u0000${segment.color ?? ''}`
    const occurrence = occurrences.get(fingerprint) ?? 0

    occurrences.set(fingerprint, occurrence + 1)

    return {
      ...segment,
      key: `${fingerprint}\u0000${occurrence}`,
    }
  })
}

export function getDiffLineKey(line: DiffDisplayLine): string {
  return `${line.type}\u0000${line.oldLineNum ?? 'null'}\u0000${line.newLineNum ?? 'null'}\u0000${line.rawText}`
}

export function getSideBySidePairKey(pair: SideBySidePair): string {
  const left = pair.left ? getDiffLineKey(pair.left) : 'null'
  const right = pair.right ? getDiffLineKey(pair.right) : 'null'

  return `${left}\u0001${right}`
}
