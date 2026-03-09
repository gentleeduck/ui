import { Box, Text } from 'ink'
import { memo } from 'react'
import { THEME } from '../app.constants'
import type { DiffDisplayLine } from '../screens/diff-screen.types'
import { get_conflict_marker_color } from './conflict-markers'
import { get_renderable_diff_segments } from './diff-line.libs'

type DiffLineProps = {
  line: DiffDisplayLine
  num_width: number
  single_num?: boolean
}

/**
 * Renders a single unified diff line with syntax highlighting and word-level highlights.
 * Supports dual-gutter (old+new line numbers) and single-gutter modes.
 */
export const DiffLineView = memo(function DiffLineView({ line, num_width, single_num }: DiffLineProps) {
  const marker_color = get_conflict_marker_color(line.raw_text)
  if (marker_color) {
    return (
      <Box>
        <Text bold color={marker_color}>
          {line.raw_text}
        </Text>
      </Box>
    )
  }

  if (line.type === 'file-header') {
    return (
      <Box>
        <Text bold color={THEME.foreground}>
          {line.raw_text}
        </Text>
      </Box>
    )
  }

  if (line.type === 'hunk-header') {
    return (
      <Box>
        <Text color={THEME.ring}>{line.raw_text}</Text>
      </Box>
    )
  }

  const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '

  const base_color =
    line.type === 'add' ? THEME.success : line.type === 'remove' ? THEME.destructive : THEME.mutedForeground
  const renderable_segments = get_renderable_diff_segments(line.segments)

  if (single_num) {
    const num = line.new_line_num ?? line.old_line_num
    const num_str = num !== null ? String(num).padStart(num_width) : ' '.repeat(num_width)

    return (
      <Box>
        <Text color={THEME.mutedForeground}>{num_str} </Text>
        <Text color={base_color}>{prefix} </Text>
        {renderable_segments.map((seg) => {
          if (seg.highlight) {
            return (
              <Text
                key={seg.key}
                color={line.type === 'remove' ? 'white' : 'black'}
                backgroundColor={line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : undefined}>
                {seg.text}
              </Text>
            )
          }

          return (
            <Text key={seg.key} color={seg.color ?? base_color}>
              {seg.text}
            </Text>
          )
        })}
      </Box>
    )
  }

  const old_num = line.old_line_num !== null ? String(line.old_line_num).padStart(num_width) : ' '.repeat(num_width)
  const new_num = line.new_line_num !== null ? String(line.new_line_num).padStart(num_width) : ' '.repeat(num_width)

  return (
    <Box>
      <Text color={THEME.mutedForeground}>
        {old_num} {new_num}{' '}
      </Text>
      <Text color={base_color}>{prefix} </Text>
      {renderable_segments.map((seg) => {
        if (seg.highlight) {
          return (
            <Text
              key={seg.key}
              color={line.type === 'remove' ? 'white' : 'black'}
              backgroundColor={line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : undefined}>
              {seg.text}
            </Text>
          )
        }

        return (
          <Text key={seg.key} color={seg.color ?? base_color}>
            {seg.text}
          </Text>
        )
      })}
    </Box>
  )
})
