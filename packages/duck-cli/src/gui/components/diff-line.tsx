import { Box, Text } from 'ink'
import React, { memo } from 'react'
import { THEME } from '../app.constants'
import type { DiffDisplayLine } from '../screens/diff-screen.types'

type DiffLineProps = {
  line: DiffDisplayLine
  num_width: number
}

export const DiffLineView = memo(function DiffLineView({ line, num_width }: DiffLineProps) {
  if (line.type === 'file-header') {
    return (
      <Text bold color={THEME.foreground}>
        {line.raw_text}
      </Text>
    )
  }

  if (line.type === 'hunk-header') {
    return <Text color={THEME.ring}>{line.raw_text}</Text>
  }

  const old_num = line.old_line_num !== null ? String(line.old_line_num).padStart(num_width) : ' '.repeat(num_width)
  const new_num = line.new_line_num !== null ? String(line.new_line_num).padStart(num_width) : ' '.repeat(num_width)
  const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '

  const base_color =
    line.type === 'add' ? THEME.success : line.type === 'remove' ? THEME.destructive : THEME.mutedForeground

  return (
    <Box>
      <Text color={THEME.mutedForeground}>
        {old_num} {new_num}{' '}
      </Text>
      <Text color={base_color}>{prefix} </Text>
      {line.segments.map((seg, i) => (
        <Text
          key={i}
          color={seg.highlight ? (line.type === 'remove' ? 'white' : 'black') : base_color}
          backgroundColor={
            seg.highlight ? (line.type === 'add' ? 'green' : line.type === 'remove' ? 'red' : undefined) : undefined
          }>
          {seg.text}
        </Text>
      ))}
    </Box>
  )
})
