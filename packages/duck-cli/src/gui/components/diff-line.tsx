import { Box, Text } from 'ink'
import React, { memo } from 'react'
import { THEME } from '../app.constants'
import type { DiffDisplayLine } from '../screens/diff-screen.types'

type DiffLineProps = {
  line: DiffDisplayLine
  num_width: number
  single_num?: boolean
}

function get_conflict_marker_color(raw_text: string): string | null {
  if (raw_text === '<<<<<<< LOCAL') return THEME.destructive
  if (raw_text === '=======') return THEME.warning
  if (raw_text === '>>>>>>> REGISTRY') return THEME.success
  return null
}

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

  if (single_num) {
    const num = line.new_line_num ?? line.old_line_num
    const num_str = num !== null ? String(num).padStart(num_width) : ' '.repeat(num_width)

    return (
      <Box>
        <Text color={THEME.mutedForeground}>
          {num_str}{' '}
        </Text>
        <Text color={base_color}>{prefix} </Text>
        {line.segments.map((seg, i) => {
          if (seg.highlight) {
            return (
              <Text
                key={i}
                color={line.type === 'remove' ? 'white' : 'black'}
                backgroundColor={line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : undefined}>
                {seg.text}
              </Text>
            )
          }

          return (
            <Text key={i} color={seg.color ?? base_color}>
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
      {line.segments.map((seg, i) => {
        if (seg.highlight) {
          return (
            <Text
              key={i}
              color={line.type === 'remove' ? 'white' : 'black'}
              backgroundColor={line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : undefined}>
              {seg.text}
            </Text>
          )
        }

        return (
          <Text key={i} color={seg.color ?? base_color}>
            {seg.text}
          </Text>
        )
      })}
    </Box>
  )
})
