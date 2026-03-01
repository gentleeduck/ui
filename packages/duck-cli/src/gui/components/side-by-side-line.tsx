import { Box, Text } from 'ink'
import React, { memo } from 'react'
import { THEME } from '../app.constants'
import type { DiffDisplayLine, SideBySidePair } from '../screens/diff-screen.types'

type SideBySideLineProps = {
  pair: SideBySidePair
  num_width: number
  half_width: number
}

function render_side(line: DiffDisplayLine | null, num_width: number, side: 'left' | 'right') {
  if (!line) {
    return null
  }

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

  const line_num = side === 'left' ? line.old_line_num : line.new_line_num
  const num_str = line_num !== null ? String(line_num).padStart(num_width) : ' '.repeat(num_width)

  const base_color =
    line.type === 'add' ? THEME.success : line.type === 'remove' ? THEME.destructive : THEME.mutedForeground

  return (
    <>
      <Text color={THEME.mutedForeground}>{num_str} </Text>
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
    </>
  )
}

export const SideBySideLine = memo(function SideBySideLine({ pair, num_width, half_width }: SideBySideLineProps) {
  return (
    <Box>
      <Box width={half_width}>{render_side(pair.left, num_width, 'left')}</Box>
      <Text color={THEME.border}> | </Text>
      <Box width={half_width}>{render_side(pair.right, num_width, 'right')}</Box>
    </Box>
  )
})
