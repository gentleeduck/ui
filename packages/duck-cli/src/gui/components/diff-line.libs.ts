import type { DiffDisplayLine, DiffSegment, SideBySidePair } from '~/utils/diff-format'

export type RenderableDiffSegment = DiffSegment & {
  key: string
}

export function get_renderable_diff_segments(segments: DiffSegment[]): RenderableDiffSegment[] {
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

export function get_diff_line_key(line: DiffDisplayLine): string {
  return `${line.type}\u0000${line.old_line_num ?? 'null'}\u0000${line.new_line_num ?? 'null'}\u0000${line.raw_text}`
}

export function get_side_by_side_pair_key(pair: SideBySidePair): string {
  const left = pair.left ? get_diff_line_key(pair.left) : 'null'
  const right = pair.right ? get_diff_line_key(pair.right) : 'null'

  return `${left}\u0001${right}`
}
